"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
 
import SendIcon from "@mui/icons-material/Send";

import dayjs from "dayjs";

import { DataGrid } from "@mui/x-data-grid";
import { getStatusColor, getStatusIcon } from "../../admin-portal/_helpers/colorhelper";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { getUserData, saveUserData, isDataFresh } from "../../../_utils/localStorageUtils";

// Local storage key used to cache letter history per user (fallback/cache)
const LS_KEY = "letterHistory";

export default function LetterHistory() {
	const router = useRouter();
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [toDelete, setToDelete] = useState(null);
	const [stats, setStats] = useState({ total: 0, generated: 0, sent: 0 });
	const [recentlyUpdated, setRecentlyUpdated] = useState(new Set());

	const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

	const mapEntriesToRows = (entries = []) => {
		return (entries || [])
			.map((e, idx) => ({
				id: e.id ?? e.requestId ?? e.createdAt ?? idx + 1,
				letterType: e.letterType || e.type || "",
				requestedAt: e.requestedAt || e.createdAt || e.date || null,
				recipientEmail: e.recipientEmail || e.email || "",
				status: (e.status || "generated").toString().toLowerCase(),
				letterHtml: e.letterHtml || e.content || "",
				fields: e.fields || {},
			}))
			.sort(
				(a, b) =>
					(b.requestedAt ? new Date(b.requestedAt).getTime() : 0) -
					(a.requestedAt ? new Date(a.requestedAt).getTime() : 0)
			);
	};

	const saveHistory = (newRows) => {
		const entries = newRows.map((r) => ({
			id: r.id,
			letterType: r.letterType,
			requestedAt: r.requestedAt || new Date().toISOString(),
			recipientEmail: r.recipientEmail,
			status: r.status,
			letterHtml: r.letterHtml,
			fields: r.fields || {},
		}));
		saveUserData(LS_KEY, entries);
	};

	const updateStats = (data) => {
		const total = data.length;
		const sent = data.filter((d) => d.status === "sent").length;
		const generated = total - sent;
		setStats({ total, generated, sent });
	};

	const checkForStatusUpdates = (oldRows, newRows) => {
		const updatedIds = new Set();
		oldRows.forEach((oldRow) => {
			const newRow = newRows.find((n) => n.id === oldRow.id);
			if (newRow && oldRow.status !== newRow.status) {
				updatedIds.add(newRow.id);
				const message = `Letter status updated to ${newRow.status}`;
				const sev = newRow.status === "sent" ? "success" : "info";
				showSnackbar(message, sev);
			}
		});
		if (updatedIds.size > 0) {
			setRecentlyUpdated(updatedIds);
			setTimeout(() => setRecentlyUpdated(new Set()), 8000);
		}
	};

	const loadHistory = async (silent = false) => {
		if (!silent) setLoading(true);
		try {
			const useCache = silent && isDataFresh(LS_KEY, 30 * 1000);
			if (useCache) {
				const cached = getUserData(LS_KEY, []);
				const mapped = mapEntriesToRows(cached);
				setRows(mapped);
				updateStats(mapped);
				return;
			}
			const res = await axiosInstance.get(API_PATHS.LETTER.REQUEST.MY);
			const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
			const mapped = mapEntriesToRows(list);
			if (silent && rows.length > 0) {
				checkForStatusUpdates(rows, mapped);
			}
			setRows(mapped);
			updateStats(mapped);
			saveHistory(mapped);
		} catch (e) {
			const cached = getUserData(LS_KEY, []);
			const mapped = mapEntriesToRows(cached);
			setRows(mapped);
			updateStats(mapped);
		} finally {
			if (!silent) setLoading(false);
		}
	};

	useEffect(() => {
		loadHistory();
		const interval = setInterval(() => loadHistory(true), 30000);
		return () => clearInterval(interval);
	}, []);

	const handleDelete = (row) => {
		setToDelete(row);
		setDeleteConfirmOpen(true);
	};

	const confirmDelete = () => {
		const updated = rows.filter((r) => r.id !== toDelete.id);
		setRows(updated);
		saveHistory(updated);
		updateStats(updated);
		setDeleteConfirmOpen(false);
		setToDelete(null);
	};

	const handleView = (row) => {
		router.push("/letter");
	};

	const handleDownload = (row) => {
		if (!row.letterHtml) {
			showSnackbar("No content to download", "warning");
			return;
		}
		const blob = new Blob([row.letterHtml], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${(row.letterType || "letter").replace(/\s+/g, "_")}_${dayjs(row.requestedAt).format("YYYYMMDD_HHmm")}.html`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	};

	const handleSend = async (row) => {
		if (!row.recipientEmail) {
			showSnackbar("Recipient email not set for this letter", "error");
			return;
		}
		if (!row.letterHtml) {
			showSnackbar("Letter content is empty", "error");
			return;
		}
		try {
			const payload = {
				recipient: row.recipientEmail,
				subject: `${row.letterType || "Letter"}`,
				content: row.letterHtml,
			};
			await axiosInstance.post(API_PATHS.LETTER.SEND, payload);
			const updated = rows.map((r) => (r.id === row.id ? { ...r, status: "sent" } : r));
			setRows(updated);
			saveHistory(updated);
			updateStats(updated);
			showSnackbar("Letter sent successfully");
		} catch (error) {
			showSnackbar(error?.response?.data?.message || "Failed to send letter", "error");
		}
	};

	const columns = [
		{ field: "letterType", headerName: "Letter Type", width: 220 },
		{
			field: "requestedAt",
			headerName: "Requested On",
			width: 150,
			renderCell: (params) => (params.value ? dayjs(params.value).format("MMM DD, YYYY") : "-"),
		},
		{ field: "recipientEmail", headerName: "Recipient", width: 200 },
		{
			field: "status",
			headerName: "Status",
			width: 130,
			renderCell: (params) => (
				<Chip
					icon={getStatusIcon(params.value)}
					label={(params.value || "generated").toString().charAt(0).toUpperCase() + (params.value || "generated").toString().slice(1)}
					color={getStatusColor(params.value || "pending")}
					size="small"
				/>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 180,
			headerClassName: "last-column",
			sortable: false,
			renderCell: (params) => (
				<Box sx={{ display: "flex", gap: 1, mt: 1 }}>
					<Tooltip title="View">
						<IconButton size="small" onClick={() => handleView(params.row)} color="primary">
							<VisibilityIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Download">
						<span>
							<IconButton
								size="small"
								onClick={() => handleDownload(params.row)}
								disabled={!params.row.letterHtml}
								color="info"
							>
								<DownloadIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Send">
						<span>
							<IconButton
								size="small"
								onClick={() => handleSend(params.row)}
								disabled={!params.row.recipientEmail || !params.row.letterHtml}
								color="success"
							>
								<SendIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Delete from history">
						<IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: "error.main" }}>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</Box>
			),
		},
	];

	return (
		<Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
			<Box sx={{ width: "100%", p: 5 }}>
				{/* Stats and actions */}
				<Box
					sx={{
						display: "flex",
						gap: 2,
						mb: 3,
						flexWrap: "wrap",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
						<Box sx={{ p: 2, borderRadius: 1, backgroundColor: "#e3f2fd", minWidth: 120, textAlign: "center" }}>
							<span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1976d2" }}>{stats.total}</span>
							<div style={{ fontSize: "0.85rem", color: "#666" }}>Total Letters</div>
						</Box>
						<Box sx={{ p: 2, borderRadius: 1, backgroundColor: "#fff3e0", minWidth: 120, textAlign: "center" }}>
							<span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#f57c00" }}>{stats.generated}</span>
							<div style={{ fontSize: "0.85rem", color: "#666" }}>Generated</div>
						</Box>
						<Box sx={{ p: 2, borderRadius: 1, backgroundColor: "#dcedc8", minWidth: 120, textAlign: "center" }}>
							<span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#388e3c" }}>{stats.sent}</span>
							<div style={{ fontSize: "0.85rem", color: "#666" }}>Sent</div>
						</Box>
					</Box>

					{/* Right side actions */}
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Typography variant="caption" color="textSecondary">
							Auto-refresh: 30s
						</Typography>
                        
						<Box sx={{ display: "flex", gap: 1, ml: 2 }}>
							<Button variant="contained" onClick={() => router.push("/letter")}>New Letter</Button>
						</Box>
					</Box>
				</Box>

				{/* Data grid */}
				<Box sx={{ width: "100%" }}>
					<DataGrid
						rows={rows}
						columns={columns}
						loading={loading}
						pageSizeOptions={[10, 50, 100]}
						initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
						disableSelectionOnClick
						getRowClassName={(params) => (recentlyUpdated.has(params.row.id) ? "recently-updated-row" : "")}
						sx={{
							"& .recently-updated-row": {
								backgroundColor: "#f3e5f5",
								animation: "pulse 2s ease-in-out",
							},
							"@keyframes pulse": {
								"0%": { backgroundColor: "#f3e5f5" },
								"50%": { backgroundColor: "#e1bee7" },
								"100%": { backgroundColor: "#f3e5f5" },
							},
									// Thinner scrollbars
									"& .MuiDataGrid-virtualScroller": {
										scrollbarWidth: "thin",
									},
									"& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
										height: 6,
										width: 8,
									},
									"& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb": {
										backgroundColor: "#bdbdbd",
										borderRadius: 8,
									},
									"& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track": {
										backgroundColor: "transparent",
									},
						}}
					/>
				</Box>
			</Box>

			{/* Delete confirmation */}
			<Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
				<DialogTitle>Remove this letter from your history?</DialogTitle>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
					<Button onClick={confirmDelete} color="error" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Paper>
	);
}

