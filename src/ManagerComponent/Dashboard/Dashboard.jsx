import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Typography, Grid, TextField, Button } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getDashboardBuybackStats, getDashboardBuybackStatsByAreas, getDashboardStats, getDashboardStatsByAreas } from '../../component/State/DashBoard/Action';
import { getAllAreaAction } from '../../component/State/Area/Action';

const Dashboard = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errors, setErrors] = useState({});

    const { dashboard, area } = useSelector(store => store);
    const loading = useSelector((state) => state.dashboard.loading);
    const error = useSelector((state) => state.dashboard.error);

    useEffect(() => {
        dispatch(getAllAreaAction(jwt));
    }, [dispatch, jwt]);

    const validateDates = (newValue, field) => {
        if (field === "startDate" && newValue && endDate && newValue > endDate) {
            setErrors((prev) => ({
                ...prev,
                startDate: "Ngày bắt đầu phải trước ngày kết thúc.",
            }));
        } else if (field === "endDate" && newValue && startDate && newValue < startDate) {
            setErrors((prev) => ({
                ...prev,
                endDate: "Ngày kết thúc phải sau ngày bắt đầu.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        validateDates(date, "startDate");
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        validateDates(date, "endDate");
    };

    const handleSearch = () => {
        if (!errors.startDate && !errors.endDate && startDate && endDate) {
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
            const areaIds = area.areas?.map(area => area.id) || [];
            console.log("areId", areaIds);
            dispatch(getDashboardStats(formattedStartDate, formattedEndDate, jwt));
            dispatch(getDashboardStatsByAreas(formattedStartDate, formattedEndDate, areaIds, jwt))
            dispatch(getDashboardBuybackStats(formattedStartDate, formattedEndDate, jwt));
            dispatch(getDashboardBuybackStatsByAreas(formattedStartDate, formattedEndDate, areaIds, jwt))
        }
    };

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Ngày bắt đầu
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Chọn ngày bắt đầu"
                                value={startDate}
                                onChange={handleStartDateChange}
                                renderInput={(params) => <TextField {...params} error={!!errors.startDate} helperText={errors.startDate} />}
                                inputFormat="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Ngày kết thúc
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Chọn ngày kết thúc"
                                value={endDate}
                                onChange={handleEndDateChange}
                                renderInput={(params) => <TextField {...params} error={!!errors.endDate} helperText={errors.endDate} />}
                                inputFormat="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </Paper>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={handleSearch} disabled={!!errors.startDate || !!errors.endDate || !startDate || !endDate}>
                        Tìm kiếm
                    </Button>
                </Grid>
            </Grid>

            <Typography variant="h4">
            Order
            </Typography>
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Orders
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.all?.totalOrders ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Amount
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.all?.totalAmount ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Sold Items
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.all?.totalItems ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>

            <div>
                <Typography variant="h6" gutterBottom>Dashboard by Areas</Typography>
                {area.areas?.length === 0 ? (
                    <Typography variant="body1">No areas available.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {area.areas.map((area) => (
                            <Grid item xs={12} md={4} key={area.id}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>
                                        {dashboard.areas?.[area.id]?.areaName || area.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Orders: {dashboard.areas?.[area.id]?.totalOrders || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Amount: {dashboard.areas?.[area.id]?.totalAmount || 'N/A'}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Sold Items: {dashboard.areas?.[area.id]?.totalItems || 'N/A'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>

            <Typography variant="h4">
            Buyback
            </Typography>
            <div>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Total Orders
                        </Typography>
                        <Typography variant="h3" component="div">
                            {loading ? 'Loading...' : dashboard.buybackAll?.totalBuybacks ?? 'N/A'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Total Amount
                        </Typography>
                        <Typography variant="h3" component="div">
                            {loading ? 'Loading...' : dashboard.buybackAll?.totalAmount ?? 'N/A'}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Total Sold Items
                        </Typography>
                        <Typography variant="h3" component="div">
                            {loading ? 'Loading...' : dashboard.buybackAll?.totalItems ?? 'N/A'}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </div>
        
        <div>
        <Typography variant="h6" gutterBottom>Dashboard  by Areas</Typography>
        {area.areas?.length === 0 ? (
            <Typography variant="body1">No areas available.</Typography>
        ) : (
            <Grid container spacing={3}>
                {area.areas.map((area) => (
                    <Grid item xs={12} md={4} key={area.id}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                {dashboard.buybackAreas?.[area.id]?.areaName || area.name}
                            </Typography>
                            <Typography variant="body1">
                                Total Orders: {dashboard.buybackAreas?.[area.id]?.totalBuybacks || '0'}
                            </Typography>
                            <Typography variant="body1">
                                Total Amount: {dashboard.buybackAreas?.[area.id]?.totalAmount || '0'}
                            </Typography>
                            <Typography variant="body1">
                                Total Sold Items: {dashboard.buybackAreas?.[area.id]?.totalItems || '0'}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        )}
    </div>

        </div>
    );
};

export default Dashboard;
