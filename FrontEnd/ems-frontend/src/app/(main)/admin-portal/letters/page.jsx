"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
 

import dayjs from "dayjs";

import CustomDataGrid from "../../_components/CustomDataGrid";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { getStatusColor, getStatusIcon } from "../_helpers/colorhelper";

// Admin Letters page: lists letter-related items and provides quick actions
export default function LettersAdminPage() {
	const router = useRouter();

	// In absence of a backend list endpoint, keep an empty set; wire up later
	const [rows, setRows] = useState([]);
	const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
	const [sendingId, setSendingId] = useState(null);
	const [loading, setLoading] = useState(false);
    

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

	const mapToRow = (e, idx) => ({
		id: e.id ?? e.requestId ?? e.createdAt ?? idx + 1,
		name: e.employeeName || e.name || e.userName || "",
		email: e.email || e.employeeEmail || e.recipientEmail || "",
		department: e.department || e.team || "",
		letterType: e.letterType || e.type || "",
		requestedAt: e.requestedAt || e.createdAt || e.date || null,
		status: (e.status || "pending").toString().toLowerCase(),
		letterHtml: e.letterHtml || e.content || "",
		fields: e.fields || {},
	});

	const fetchRequests = async (silent = false) => {
		if (!silent) setLoading(true);
		try {
			const res = await axiosInstance.get(API_PATHS.LETTER.REQUEST.ALL);
			const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
			const mapped = list.map(mapToRow);
			setRows(mapped.sort((a,b) => (b.requestedAt ? new Date(b.requestedAt).getTime() : 0) - (a.requestedAt ? new Date(a.requestedAt).getTime() : 0)));
		} catch (e) {
			setRows([]);
			showSnackbar(e?.response?.data?.message || "Failed to load requests", "error");
		} finally {
			if (!silent) setLoading(false);
		}
	};

	useEffect(() => {
		fetchRequests();
		const i = setInterval(() => fetchRequests(true), 30000);
		return () => clearInterval(i);
	}, []);

	// Placeholder "send" using known API path; adjust payload to backend contract when available
	const handleSend = async (row) => {
		try {
			setSendingId(row.id);
			// Minimal payload example; update to match backend expectations
			const payload = {
				recipient: row.email || row.recipientEmail,
				subject: `${row.letterType || "Letter"} - ${row.name || row.employeeName || "Employee"}`,
				content: row.letterHtml || "", // Ensure you pass the generated HTML/content when available
			};
			if (!payload.recipient) {
				showSnackbar("Recipient email missing for this row", "error");
				return;
			}
			await axiosInstance.post(API_PATHS.LETTER.SEND, payload);
			// Optimistic UI update of status if rows come from state
			setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: "sent" } : r)));
			showSnackbar("Letter sent successfully");
		} catch (error) {
			showSnackbar(error?.response?.data?.message || "Failed to send letter", "error");
		} finally {
			setSendingId(null);
		}
	};

	const handleGenerate = async (row) => {
		try {
			setSendingId(row.id);
			const res = await axiosInstance.post(API_PATHS.LETTER.GENERATE_FROM_REQUEST(row.id));
			const html = res.data?.letterHtml || res.data?.data?.letterHtml;
			if (!html) throw new Error('No letter HTML returned');
			setRows(prev => prev.map(r => r.id === row.id ? { ...r, letterHtml: html, status: 'generated' } : r));
			showSnackbar('Letter generated');
		} catch (e) {
			showSnackbar(e?.response?.data?.message || e.message || 'Failed to generate', 'error');
		} finally {
			setSendingId(null);
		}
	};

	const columns = [
		{ field: "name", headerName: "Employee", width: 160, valueGetter: (p) => p.row?.name || p.row?.employeeName || "" },
		{ field: "email", headerName: "Email", width: 180 },
		{ field: "department", headerName: "Department", width: 140 },
		{ field: "letterType", headerName: "Letter Type", width: 220 },
		{
			field: "requestedAt",
			headerName: "Requested",
			width: 140,
			renderCell: (params) => (params.value ? dayjs(params.value).format("MMM DD, YYYY") : "-"),
		},
		{
			field: "status",
			headerName: "Status",
			width: 130,
			renderCell: (params) => (
				<Chip
					icon={getStatusIcon(params.value)}
					label={(params.value || "pending").toString().charAt(0).toUpperCase() + (params.value || "pending").toString().slice(1)}
					color={getStatusColor(params.value || "pending")}
					size="small"
				/>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 200,
			headerClassName: "last-column",
			sortable: false,
			renderCell: (params) => (
				<Box sx={{ display: "flex", gap: 1, mt: 1 }}>
					<Tooltip title="Generate from request">
						<span>
							<IconButton
								size="small"
								onClick={() => handleGenerate(params.row)}
								disabled={sendingId === params.row?.id}
								color="primary"
							>
								<ContentPasteGoIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Preview">
						<span>
							<IconButton
								size="small"
								onClick={() => window.open().document.write(params.row.letterHtml || '<p>No content</p>')}
								color="info"
							>
								<VisibilityIcon />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title="Send">
						<span>
							<IconButton
								size="small"
								onClick={() => handleSend(params.row)}
								disabled={!params.row?.email || !params.row?.letterHtml || sendingId === params.row?.id}
								color="success"
							>
								<SendIcon />
							</IconButton>
						</span>
					</Tooltip>
				</Box>
			),
		},
	];

    

	return (
		<Paper elevation={3} sx={{ width: "100%", height: "100%" }}>
			<Box sx={{ p: 3 }}>
				<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
					<Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
						Letters Management
					</Typography>
					<Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
						<Typography variant="caption" color="textSecondary">Auto-refresh: 30s</Typography>
						<Button variant="contained" onClick={() => router.push("/letter")}>
							New Letter
						</Button>
					</Box>
				</Box>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					View and manage letter requests. Use “New Letter” to generate a new letter.
				</Typography>

				<Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
					<Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 1 }}>
						<CustomDataGrid rows={rows} columns={columns} />
					</Box>
				</Box>
			</Box>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={3000}
				onClose={() => setSnackbar({ ...snackbar, open: false })}
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
			>
				<Alert
					onClose={() => setSnackbar({ ...snackbar, open: false })}
					severity={snackbar.severity}
					variant="filled"
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Paper>
	);
}

