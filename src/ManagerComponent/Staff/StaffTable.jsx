import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, CardHeader, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getAllStaffUser, deleteStaffUser } from '../../component/State/Authentication/Action';
import { Delete } from "@mui/icons-material";
export default function StaffTable() {
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store);
    const jwt = localStorage.getItem("jwt");

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getAllStaffUser(jwt));
    }, [dispatch, jwt]);

    const handleDelete = (username) => {
        if (window.confirm("Are you sure you want to delete this account?")) {
            dispatch(deleteStaffUser(jwt, username));
        }
    };

    // Filtered staff based on search term
    const filteredStaff = auth.users.filter(user =>
        user.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ padding: 2 }}>
            <Card sx={{ mt: 2, boxShadow: 3 }}>
            <CardHeader
          title={"Staff"}
          sx={{
            pt: 2,
            pb: 1,
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            backgroundColor: "#0B4CBB",
            color: "#fff",
          }}
        />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 2,marginTop: 2 }}>
                    <TextField
                        id="search-input"
                        label="Search by Name"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "gray",
                                },
                                "&:hover fieldset": {
                                    borderColor: "gray",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "gray",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "gray",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                                color: "gray",
                            },
                        }}
                    />
                    <IconButton aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#0B4CBB" }}>
                                <TableCell align="left">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Full Name
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Gender
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Role
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Area
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Email
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{ fontWeight: "bold", color: "white" }}
                                    >
                                        Delete
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStaff.length > 0 ? (
                                filteredStaff.map((row) => (
                                    <TableRow
                                        key={row.username}
                                        sx={{
                                            "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                                            "&:hover": { backgroundColor: "#e0e0e0", cursor: "pointer" },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.fullname}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.gender}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.role}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.areaName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleDelete(row.username)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No staff found with the given search criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
