import React, { useState } from 'react';
import {
    Dashboard, ShoppingBag, Home, Group, Checklist, Logout,
    Category, Diamond, Event, ShopTwo, ShoppingCartCheckout, Menu as MenuIcon
} from '@mui/icons-material';
import {
    Divider, Drawer, Typography, useMediaQuery, IconButton, Box,
    List, ListItem, ListItemIcon, ListItemText, useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../component/State/Authentication/Action';
import { styled } from '@mui/system';

const menu = [
    { title: "Home", icon: <Home />, path: "/" },
    { title: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { title: "Orders", icon: <ShoppingBag />, path: "/orders" },
    { title: "Menu", icon: <ShopTwo />, path: "/menu" },
    { title: "Category", icon: <Category />, path: "/category" },
    { title: "Ingredients", icon: <Diamond />, path: "/ingredients" },
    { title: "Staff", icon: <Group />, path: "/teams" },
    { title: "Customer", icon: <Checklist />, path: "/customer" },
    { title: "Buyback", icon: <ShoppingCartCheckout />, path: "/buyback" },
    { title: "Events", icon: <Event />, path: "/event" },
    { title: "Logout", icon: <Logout sx={{ color: 'red' }} />, path: "/logout" },
];

const Logo = styled('img')({
    height: 80,
    backgroundColor: '#00ABE1',
    padding: '8px',
    borderRadius: '50%',
});

const AdminSidebar = () => {
    const isSmallScreen = useMediaQuery("(max-width:1080px)");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const theme = useTheme();

    const handleNavigate = (item) => {
        if (item.title === "Logout") {
            dispatch(logout());
            navigate("/");
        } else {
            navigate(`/manager/jewelry${item.path}`);
        }
        if (isSmallScreen) setDrawerOpen(false);
    };

    const handleLogoClick = () => {
        navigate("/manager/jewelry");
        if (isSmallScreen) setDrawerOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {isSmallScreen && (
                <IconButton
                    onClick={() => setDrawerOpen(true)}
                    sx={{ position: 'fixed', top: 16, left: 16, zIndex: 1300 }}
                >
                    <MenuIcon fontSize="large" />
                </IconButton>
            )}
            <Drawer
                variant={isSmallScreen ? "temporary" : "permanent"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                anchor='left'
                sx={{ zIndex: 1200 }}
            >
                <Box
                    sx={{
                        width: isSmallScreen ? '70vw' : '15vw',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: theme.palette.primary.main,
                        color: 'white',
                        p: 2,
                    }}
                >
                    <Box
                        onClick={handleLogoClick}
                        sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 2,
                            cursor: 'pointer',
                        }}
                    >
                        <Logo
                            src="https://cdn.pnj.io/images/logo/pnj.com.vn.png"
                            alt="Logo"
                        />
                    </Box>
                    <Divider sx={{ width: '100%', mb: 2, backgroundColor: 'white' }} />
                    <List sx={{ width: '100%' }}>
                        {menu.map((item, i) => (
                            <ListItem
                                button
                                key={i}
                                onClick={() => handleNavigate(item)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary.dark,
                                    },
                                    transition: 'all 0.3s',
                                    mb: 1,
                                }}
                            >
                                <ListItemIcon sx={{ color: 'white' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {item.title}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default AdminSidebar;