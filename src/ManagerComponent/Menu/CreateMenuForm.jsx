import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import * as Yup from 'yup';
import { getAllCategory } from '../../component/State/Categories/Action';
import { getAllComponent } from '../../component/State/Components/Action';
import { createMenuItem } from '../../component/State/Menu/Action';
import { uploadImageToCloudinary } from '../util/UploadToCloudinary';

const initialValues = {
    name: "",
    description: "",
    code: "",
    category: "",
    selectedComponents: [],
    selectedComponents2: [],
    goldWeight: "",
    diamondWeight: "",
    images: []
};

const validationSchema = Yup.object({
    name: Yup.string()
    .required('Name is required'),
    description: Yup.string()
    .required('Description is required'),
    code: Yup.string()
    .required('Jewelry Code is required'),
    category: Yup.string()
    .required('Category is required'),
    goldWeight: Yup.number()
    .positive('Gold Weight must be positive'),
    diamondWeight: Yup.number()
    .positive('Diamond Weight must be positive'),
});

const CreateMenuForm = () => {
    const [uploadImage, setUploadImage] = useState(false);
    const { component } = useSelector(store => store);
    const { category } = useSelector(store => store);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Sử dụng useNavigate để chuyển hướng
    const jwt = localStorage.getItem("jwt");
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            const menu = {
                name: values.name,
                description: values.description,
                code: values.code,
                jewelryCategory: values.category,
                components: [values.selectedComponents, values.selectedComponents2],
                goldWeight: values.goldWeight,
                diamondWeight: values.diamondWeight,
                images: values.images,
            };

            console.log("data ---", menu);

            dispatch(createMenuItem({ menu, jwt }));

            // Chuyển hướng về trang danh sách sản phẩm
            navigate('/admin/jewelry/menu');
        },
    });

    
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setUploadImage(true);
        const image = await uploadImageToCloudinary(file);
        console.log("image ---", image);
        formik.setFieldValue("images", [...formik.values.images, image]);
        setUploadImage(false);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...formik.values.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("images", updatedImages);
    };

    useEffect(() => {
        dispatch(getAllCategory({ jwt }));
    }, []);

    useEffect(() => {
        dispatch(getAllComponent({ jwt }));
    }, []);

    const handleChangeComponents = (event) => {
        const { value } = event.target;
        formik.setFieldValue("selectedComponents", value);
    };

    const handleChangeComponents2 = (event) => {
        const { value } = event.target;
        formik.setFieldValue("selectedComponents2", value);
    };

    return (
        <div className='py-10 lg:flex px-5 items-center justify-center min-h-screen'>
            <div className="lg:max-w-4xl">
                <h1 className='font-bold text-2xl text-center py-2'>
                    Add New Jewelry
                </h1>
                <form onSubmit={formik.handleSubmit} className='space-y-4'>
                {/* {errorMessage && (
                        <div style={{ color: 'red', marginBottom: '10px' }}>
                            {errorMessage}
                        </div>
                    )} */}
                    <Grid container spacing={2}>
                        <Grid className='flex flex-wrap gap-5' item xs={12}>
                            <input
                                accept='image/*'
                                id='fileInput'
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                                type='file' />

                            <label className='relative' htmlFor='fileInput'>
                                <span className='w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-600'>
                                    <AddPhotoAlternateIcon className="text-white" />
                                </span>
                                {uploadImage && (
                                    <div className='absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center'>
                                        <CircularProgress />
                                    </div>
                                )}
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {formik.values.images.map((image, index) => (
                                    <div className="relative" key={index}>
                                        <img
                                            className='w-24 h-24 object-cover'
                                            src={image}
                                            alt="" />
                                        <IconButton
                                            size='small'
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                outline: "none"
                                            }}
                                            onClick={() => handleRemoveImage(index)}>
                                            <CloseIcon sx={{ fontSize: "1rem" }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Name"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="description"
                                name="description"
                                label="Description"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                onBlur={formik.handleBlur}
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
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
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                id="code"
                                name="code"
                                label="Jewelry Code"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.code}
                                onBlur={formik.handleBlur}
                                error={formik.touched.code && Boolean(formik.errors.code)}
                                helperText={formik.touched.code && formik.errors.code}
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
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="category"
                                    value={formik.values.category} // Nên là id của category
                                    onChange={formik.handleChange}
                                    name="category"
                                    onBlur={formik.handleBlur}
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
                                >
                                    {category.categories.map((category) => (
                                        <MenuItem key={category.id} value={category.name}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.category && formik.errors.category && (
                                <FormHelperText>{formik.errors.category}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="components-label">Components 1</InputLabel>
                                <Select
                                    labelId="components-label"
                                    id="selectedComponents"
                                    name="selectedComponents"
                                    value={formik.values.selectedComponents}
                                    onChange={handleChangeComponents}
                                    input={<OutlinedInput id="select-single-chip" label="Components 1" />}
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
                                >
                                    {component.components.map((component) => (
                                        <MenuItem key={component.id} value={component.name}>
                                            {component.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="components-label-2">Components 2</InputLabel>
                                <Select
                                    labelId="components-label-2"
                                    id="selectedComponents2"
                                    name="selectedComponents2"
                                    value={formik.values.selectedComponents2}
                                    onChange={handleChangeComponents2}
                                    input={<OutlinedInput id="select-single-chip-2" label="Components 2" />}
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
                                >
                                    {component.components.map((component) => (
                                        <MenuItem key={component.id} value={component.name}>
                                            {component.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                id="goldWeight"
                                name="goldWeight"
                                label="Gold Weight"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.goldWeight}
                                onBlur={formik.handleBlur}
                                error={formik.touched.goldWeight && Boolean(formik.errors.goldWeight)}
                                helperText={formik.touched.goldWeight && formik.errors.goldWeight}
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
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <TextField
                                fullWidth
                                id="diamondWeight"
                                name="diamondWeight"
                                label="Diamond Weight"
                                variant="outlined"
                                onChange={formik.handleChange}
                                value={formik.values.diamondWeight}
                                onBlur={formik.handleBlur}
                                error={formik.touched.diamondWeight && Boolean(formik.errors.diamondWeight)}
                                helperText={formik.touched.diamondWeight && formik.errors.diamondWeight}
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
                        </Grid>
                    </Grid>
                    <Button variant="contained" color="primary" type="submit" 
                     sx={{
                        mt: 2,
                        bgcolor: "#0B4CBB",
                        color: 'white',
                        fontWeight: 'bold',
                        height: '40px', // Adjust height as needed
                        padding: '8px',
                        '&:hover': {
                          bgcolor: 'darkorange',
                        },
                        '&:focus': {
                          bgcolor: 'black',
                        },
                      }}
                    >
                        Create
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateMenuForm;
