import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Button,
  Card,
  Modal,
  Box,
  TextField,
  Grid,
} from "@mui/material";
import { CartItem } from "./CartItem";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import StoreIcon from "@mui/icons-material/Store";
import PaymentIcon from "@mui/icons-material/Payment";
import RedeemIcon from "@mui/icons-material/Redeem";
import GiftIcon from "@mui/icons-material/CardGiftcard";
import SupportIcon from "@mui/icons-material/Support";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ServiceIcon from "@mui/icons-material/SupportAgent";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";

import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../State/Order/Action";
import { toast, ToastContainer } from "react-toastify";
import {
  addItemToCartByCode,
  applyCoupon,
  clearCartAction,
} from "../State/Cart/Action";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  outline: "none",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  fullname: "",
  mobile: "",
  email: "",
};

const Cart = () => {
  const [open, setOpen] = useState(false);
  const [productCode, setProductCode] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [customInvoicePercentage, setCustomInvoicePercentage] = useState("");

  const { cart } = useSelector((store) => store);
  const dispatch = useDispatch();

  const handleClose = () => setOpen(false);

  const handleSubmit = (values) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        staffId: cart.cart?.staff?.id,
        fullname: values.fullname,
        mobile: values.mobile,
        email: values.email,
        items: cart.cartItems.map((item) => ({
          productId: item.jewelry.id,
          quantity: item.quantity,
          price: item.totalPrice,
        })),
      },
    };
    dispatch(createOrder(data));
    dispatch(clearCartAction());
    setOpen(false);
  };

  const handleOpenAddressModal = () => setOpen(true);

  const handleAddToCart = async () => {
    if (productCode.trim() === "") {
      alert("Please enter a product code.");
      return;
    }

    const reqData = {
      jwt: localStorage.getItem("jwt"),
      cartItem: {
        code: productCode,
        quantity: 1,
      },
    };

    try {
      await dispatch(addItemToCartByCode(reqData));
      setProductCode("");
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(`${error.response.data}`); // Show specific error message
      } else {
        toast.error("Wrong code. Please try again."); // Fallback error message
      }
      console.error("error:", error);
    }
  };

  const handleApplyCoupon = async () => {
    if (couponCode.trim() === "") {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      await dispatch(
        applyCoupon(cart.cart.id, couponCode, localStorage.getItem("jwt"))
      );
      toast.success("COUPON APPLIDED SUCCESSFULLY!"); // Show success message
      setCouponCode("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(`${error.response.data.message}`); // Show specific error message
      } else {
        toast.error("Failed to apply coupon. Please try again."); // Fallback error message
      }
      console.error("Coupon apply error:", error);
    }
  };

  const handleClearCart = () => {
    dispatch(clearCartAction());
    window.location.reload(); // This should ideally be handled better in a SPA
  };

  const calculateTotal = () => {
    if (cart.cartItems.length === 0) {
      return 0;
    }

    const itemTotal = cart.cart?.total || 0;
    const totalBeforeDiscount = itemTotal;
    const customPercent = parseFloat(customInvoicePercentage);

    if (isNaN(customPercent)) {
      return totalBeforeDiscount;
    } else {
      const invoiceAmount = totalBeforeDiscount * (customPercent / 100);
      return totalBeforeDiscount + invoiceAmount;
    }
  };

  const handleCustomInvoiceChange = (e) => {
    setCustomInvoicePercentage(e.target.value);
  };

  return (
    <>
      <div>
        <main className="lg:flex justify-between  bg-[#fbfbfb]">
          <section className="lg:w-[40%] space-y-6 lg:min-h-screen pt-10">
            {cart.cartItems.length > 0 ? (
              <TableContainer
                component={Paper}
                className="mt-5 mx-auto"
                sx={{ maxWidth: "500px" }}
              >
                <Typography variant="h6" className="p-3">
                  Cart Items
                </Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Product</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cart.cartItems.map((item, index) => (
                      <TableRow key={`${item.id}-${index}`}>
                        <CartItem key={`${item.id}-${index}`} item={item} />
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="h6"
                className="p-1"
                sx={{
                  textAlign: "center",
                  backgroundColor: "#F22B2B", // Thêm màu nền
                  color: "white", // Thay đổi màu chữ nếu cần để dễ đọc
                  padding: "2px", // Điều chỉnh padding để đảm bảo văn bản không dính sát vào cạnh
                  borderRadius: "1px", // Thêm viền bo tròn nếu muốn
                  fontWeight: "bold", // Làm cho văn bản đậm
                  //display: "inline-block", // Làm cho chiều rộng phù hợp với nội dung
                }}
              >
                No Product In Cart
              </Typography>
            )}
            <Divider />
            {/* Product Code Input */}
            <Card
              className="flex gap-90 w-80 p-2 mt-2"
              sx={{
                margin: "auto", // Center horizontally
                textAlign: "center", // Center content inside the card
              }}
            >
              <TextField
                label="Product Code"
                variant="outlined"
                fullWidth
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
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
              <Button
                variant="outlined"
                fullWidth
                onClick={handleAddToCart}
                sx={{
                  color: "green",
                  borderColor: "green",
                  fontWeight: "bold",
                  width: "120px",
                  "&:hover": {
                    borderColor: "darkyellow",
                    backgroundColor: "lightyellow",
                  },
                }}
              >
                Add
              </Button>
            </Card>
            {/* Coupon Code Input */}
            <Card
              className="flex gap-90 w-80 p-2 mt-2"
              sx={{
                margin: "auto", // Center horizontally
                textAlign: "center", // Center content inside the card
              }}
            >
              <TextField
                label="Coupon Code"
                variant="outlined"
                fullWidth
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
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
              <Button
                variant="outlined"
                fullWidth
                onClick={handleApplyCoupon}
                sx={{
                  color: "green",
                  borderColor: "green",
                  fontWeight: "bold",
                  width: "120px",
                  "&:hover": {
                    borderColor: "darkyellow",
                    backgroundColor: "lightyellow",
                  },
                }}
              >
                Coupon
              </Button>
            </Card>
            {/* Clear Cart Button */}
            <div className="flex justify-center mt-2">
              <Button
                variant="outlined"
                onClick={handleClearCart}
                sx={{
                  color: "red",
                  borderColor: "red",
                  fontWeight: "bold",
                  width: "200px",
                  marginTop: "10px",
                  "&:hover": {
                    borderColor: "darkred",
                    backgroundColor: "lightcoral",
                  },
                }}
              >
                Clear Cart
              </Button>
            </div>

            {/* Bill Details */}
            <TableContainer
              component={Paper}
              className="mt-5 mx-auto"
              sx={{ maxWidth: "500px" }}
            >
              <Typography variant="h6" className="p-3">
                Bill Details
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Item Total</TableCell>
                    <TableCell align="right">
                      {cart.cart?.coupon
                        ? cart.cart.totalamount
                        : calculateTotal()}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Discount</TableCell>
                    <TableCell align="right">
                      {cart.cart?.coupon
                        ? `${cart.cart.coupon.discountPercentage}%`
                        : "No coupon applied"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Pay</TableCell>
                    <TableCell align="right">{calculateTotal()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </section>
          <Divider orientation="vertical" flexItem />
          <section className="lg:w-[60%] flex justify-center px-5 pb-0 lg:pb-0">
            <Box>
              <Typography
                variant="h4"
                component="h1"
                align="center"
                fontWeight="bold"
                gutterBottom
                py={4}
              >
                Payment Here
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                flexWrap="wrap"
                gap={3}
              >
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: 256,
                    padding: 3,
                    boxShadow: 3,
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 40, color: "gray" }} />
                  <Box textAlign="center" color="gray">
                    <Typography variant="body1" gutterBottom>
                      Customer Information
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleOpenAddressModal}
                      sx={{
                        color: "green",
                        borderColor: "green",
                        fontWeight: "bold",
                        "&:hover": {
                          borderColor: "darkyellow",
                          backgroundColor: "lightyellow",
                        },
                      }}
                    >
                      ADD
                    </Button>
                  </Box>
                </Card>
              </Box>
              <Box
                mt={10}
                sx={{ backgroundColor: "#f5f5f5", padding: 1, borderRadius: 8 }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  align="center"
                  fontWeight="bold"
                  gutterBottom
                >
                  Ưu đãi
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <LocalOfferIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        Giá sản phẩm thay đổi tuỳ trọng lượng vàng và đá
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <CompareArrowsIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        Đổi sản phẩm trong 48h tại hệ thống cửa hàng PNJ
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <StoreIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">Cầm đồ và Thu mua</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <PaymentIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        Giảm tới 500K khi thanh toán bằng PAYPAL
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <RedeemIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        Cơ hội nhận quà tặng Vàng Tài Lộc 01 chỉ & mã ưu đãi mua
                        hàng đến 10 triệu
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <GiftIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        Cơ hội nhận quà tặng máy sấy duỗi Dyson Airstrait
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <SupportIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">
                        MIỄN PHÍ giao trong 3 giờ
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <ServiceIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">Phục vụ 24/7</Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Card
                      sx={{ display: "flex", alignItems: "center", padding: 2 }}
                    >
                      <SwapHorizontalCircleIcon
                        sx={{ fontSize: 30, color: "gray", marginRight: 2 }}
                      />
                      <Typography variant="body1">Thu đổi 48h</Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </section>
        </main>

        {/* Modal for Address */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h2 id="modal-modal-title" className="text-xl font-semibold">
              Enter Information
            </h2>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {({ handleSubmit, handleChange, values }) => (
                <Form onSubmit={handleSubmit} className="space-y-3 mt-5">
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Mobile"
                    variant="outlined"
                    fullWidth
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    required
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" variant="contained" fullWidth>
                    Submit
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Modal>
      </div>
      <ToastContainer />
    </>
  );
};
export default Cart;
