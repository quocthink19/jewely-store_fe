import React, { useEffect, useState } from "react";
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuCard from './MenuCard';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAreaById } from "../State/Area/Action";
import { getMenuItemsByJewelryId } from "../State/Menu/Action";
import { getAllCategory } from "../State/Categories/Action";
import { Navbar } from "../Navbar/Navbar";
const jewelryTypes = [
  { label: "ALL", value: "all" },
  { label: "Gold", value: "Gold" },
  { label: "Platinum", value: "Platinum" },
  { label: "Silver", value: "Silver" },
];

const JewelryDetails = () => {
  const [jewelryType, setJewelryType] = useState("all");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("price_low_to_high"); // default sorting
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { area, menu } = useSelector((store) => store);
  const { id } = useParams();
  //window.scrollTo(0,0); // cuộn lên trang 

  useEffect(() => {
    dispatch(getAreaById({ jwt, areaId: id }));
  }, [dispatch, jwt, id]);
  
  useEffect(() => {
    dispatch(getAllCategory({ jwt }));
  }, [dispatch, jwt]);
  
  useEffect(() => {
    dispatch(getMenuItemsByJewelryId({ jwt }));
  }, [dispatch, jwt]);

  const handleFilter = (e) => {
    setJewelryType(e.target.value);
  };

  const handleFilterByPrice = (range) => {
    setPriceRange(range);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const filteredItems = menu.menuItems
    .filter((item) =>
      jewelryType === "all" ? true : item.type === jewelryType
    )
    .filter((item) => {
      switch (priceRange) {
        case "50-200":
          return item.price >= 50 && item.price <= 200;
        case "200-1000":
          return item.price >= 200 && item.price <= 1000;
        case "1000+":
          return item.price > 1000;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_low_to_high":
          return a.price - b.price;
        case "price_high_to_low":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const radioStyles = {
    "&.Mui-checked": {
      color: "gray",
    },
  };

  const formControlStyles = {
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
  };

  return (
    <div>
       <Navbar/>
    <div className="px-5 lg:px-20">
      <section>
        <h3 className="text-gray-500 py-2 mt-10">Home/JewelryProduct</h3>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <img className="w-full h-[40vh] object-cover" src={area.area?.images[0]} alt="" />
            </Grid>
            <Grid item xs={12} lg={6}>
              <img className="w-full h-[40vh] object-cover" src="https://images.pexels.com/photos/9838851/pexels-photo-9838851.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            </Grid>
            <Grid item xs={12} lg={6}>
              <img className="w-full h-[40vh] object-cover" src="https://images.pexels.com/photos/20796890/pexels-photo-20796890/free-photo-of-vang-nh-n-trang-s-c-kim-c-ng.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            </Grid>
          </Grid>
        </div>
        <div className="pt-3 pb-5">
          <h1 className="text-4x1 font-semibold">{area.area?.name}</h1>
          <p className="text-gray-500 mt-1"> {area.area?.description}</p>

          <div className="space-y-3 mt-3">
            <p className="text-gray-500 flex items-center gap-3">
              <LocationOnIcon />
              <span>ThaoDien, District 2, HCM City</span>
            </p>
            <p className="text-gray-500 flex items-center gap-3">
              <CalendarTodayIcon />
              <span>9:00 AM to 8:30 PM</span>
            </p>
          </div>
        </div>
      </section>
      <Divider />
      <section className="pt-[2rem] lg:flex relative">
        <div className="space-y-10 lg:w-[20%] filter">
          <div className="box space-y-5 lg:sticky top-28 d">
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem", color: "gray" }}>
                Sort By
              </Typography>
              <FormControl variant="outlined" className="w-full" sx={formControlStyles}>
                <Select value={sortBy} onChange={handleSortChange}>
                  <MenuItem value="price_low_to_high">Price: Low to High</MenuItem>
                  <MenuItem value="price_high_to_low">Price: High to Low</MenuItem>
                </Select>
              </FormControl>
            </div>
            <Divider />
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                Jewelry Type
              </Typography>
              <FormControl className="py-10 space-y-5" component={"fieldset"}>
                <RadioGroup onChange={handleFilter} name="jewelry_type" value={jewelryType}>
                  {jewelryTypes.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      value={item.value}
                      control={<Radio sx={radioStyles} />}
                      label={item.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
            <Divider />
            <div>
              <Typography variant="h5" sx={{ paddingBottom: "1rem" }}>
                Price Range
              </Typography>
              <FormControl className="py-10 space-y-5" component={"fieldset"}>
                <RadioGroup>
                  <FormControlLabel
                    value="50-200"
                    control={<Radio sx={radioStyles} />}
                    label="50 - 200"
                    onChange={() => handleFilterByPrice("50-200")}
                  />
                  <FormControlLabel
                    value="200-1000"
                    control={<Radio sx={radioStyles} />}
                    label="200 - 1000"
                    onChange={() => handleFilterByPrice("200-1000")}
                  />
                  <FormControlLabel
                    value="1000+"
                    control={<Radio sx={radioStyles} />}
                    label="Over 1000"
                    onChange={() => handleFilterByPrice("1000+")}
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        <Grid container spacing={4} className="lg:w-80 lg:pl-10">
          {filteredItems.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
              <div style={{ width: "100%", height: "450%" }}>
                <MenuCard item={item} />
              </div>
            </Grid>
          ))}
        </Grid>
      </section>
    </div>
    </div>
  );
};

export default JewelryDetails;
