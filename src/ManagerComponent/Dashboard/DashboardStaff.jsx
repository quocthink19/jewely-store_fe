import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Typography, Grid, TextField, Button } from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { getDashboardStats, getDashboardStatsByArea } from '../../component/State/DashBoard/Action';
import { getAllAreaAction, getAreaById, getAreaByUserId } from '../../component/State/Area/Action';
import { getUser } from '../../component/State/Authentication/Action';

const Dashboard = () => {
    const dispatch = useDispatch();
    const jwt = localStorage.getItem("jwt");

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [errors, setErrors] = useState({});

    const { dashboard } = useSelector(store => store);
    const loading = useSelector((state) => state.dashboard.loading);
    const { area } = useSelector(store => store);
    const { auth } = useSelector(store => store);

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

    useEffect(() => {
        if (jwt) {
            dispatch(getAreaByUserId(jwt));
        }
    }, [dispatch, jwt]);

    useEffect(() => {
        const jwt = localStorage.getItem('jwt');
        if (jwt && !auth.user) {
          const user = JSON.parse(localStorage.getItem('user'));
          dispatch(getUser(user));
        }
      }, [auth.user, dispatch]);

    const handleSearch = () => {
        if (!errors.startDate && !errors.endDate && startDate && endDate) {
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');
            dispatch(getDashboardStatsByArea(formattedStartDate, formattedEndDate,area.userArea.id ,jwt));
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
          
            <Grid container justifyContent="center" alignItems="center">
            <Typography variant="h4">
                {auth.user ? auth.user.areaName : ''}
            </Typography>
            </Grid>
            
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Orders
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.area?.totalOrders ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Amount
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.area?.totalAmount ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Total Sold Items
                            </Typography>
                            <Typography variant="h3" component="div">
                                {loading ? 'Loading...' : dashboard.area?.totalItems ?? 'N/A'}
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Dashboard;
