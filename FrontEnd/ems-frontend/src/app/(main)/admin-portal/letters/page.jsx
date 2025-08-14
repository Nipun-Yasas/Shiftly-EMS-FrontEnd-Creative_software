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
// Removed preview/send actions per requirements
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
// Removed update/reject actions per requirements
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
 

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
	const [loading, setLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);
    

	const showSnackbar = (message, severity = "success") => {
		setSnackbar({ open: true, message, severity });
	};

    const mapToRow = (e, idx) => ({
        id: e.id ?? e.requestId ?? e.createdAt ?? idx + 1,
        // Use DTO-provided fields first
        name: e.employeeName || e.name || e.userName || e.employee_name || "",
        employeeName: e.employeeName || e.name || e.userName || e.employee_name || "",
        department: e.departmentName || e.department || e.team || "",
        letterType: e.letterType || e.type || "",
        requestedAt: e.requestedAt || e.requested_at || e.createdAt || e.date || null,
        status: (e.status || "unread").toString().toLowerCase(),
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

	const handleUpdateStatus = async (row, status) => {
		try {
			setUpdatingId(row.id);
			await axiosInstance.put(`${API_PATHS.LETTER.REQUEST.UPDATE_STATUS(row.id)}?status=${encodeURIComponent(status)}`);
			setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: status.toString().toLowerCase() } : r)));
			showSnackbar(`Status updated to ${status}`);
		} catch (error) {
			showSnackbar(error?.response?.data?.message || "Failed to update status", "error");
		} finally {
			setUpdatingId(null);
		}
	};

	useEffect(() => {
		fetchRequests();
		const i = setInterval(() => fetchRequests(true), 30000);
		return () => clearInterval(i);
	}, []);

	// Redirect to centralized letter generation page with requestId
	const handleGenerate = (row) => {
		router.push(`/admin-portal/letters/generate/${row.id}`);
	};

	// No separate update/reject actions in simplified UI

	const columns = [
        { field: "employeeName", headerName: "Employee", width: 180, valueGetter: (p) => p.row?.employeeName || p.row?.name || "" },
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
                    label={(params.value || "unread").toString().charAt(0).toUpperCase() + (params.value || "unread").toString().slice(1)}
                    color={getStatusColor(params.value || "unread")}
					size="small"
				/>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
            width: 220,
			headerClassName: "last-column",
			sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Tooltip title="Generate">
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => handleGenerate(params.row)}
                                color="primary"
                            >
                                <ContentPasteGoIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Mark as Read">
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => handleUpdateStatus(params.row, 'READ')}
                                disabled={updatingId === params.row?.id}
                                color="secondary"
                            >
                                <MarkEmailReadIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Mark as Unread">
                        <span>
                            <IconButton
                                size="small"
                                onClick={() => handleUpdateStatus(params.row, 'UNREAD')}
                                disabled={updatingId === params.row?.id}
                                color="default"
                            >
                                <MarkEmailUnreadIcon />
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

