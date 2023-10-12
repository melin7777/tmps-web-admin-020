'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from "@/components/modals/Loading";
import { Button, Checkbox, CircularProgress, Dialog, FormControlLabel, IconButton, InputAdornment, MenuItem, Radio, Tab, Tabs, TextField } from "@mui/material";
import { Add, AddAPhoto, ArrowDropDown, CameraAlt, CropRotate, Delete, Folder, KeyboardArrowLeft, Save } from "@mui/icons-material";
import useWindowDimensions from '@/hooks/useWindowDimension';
import CategoriesBrowser from '@/components/browsers/CategoriesBrowser';
import BrandsBrowser from '@/components/browsers/BrandsBrowser';
import ModelsBrowser from '@/components/browsers/ModelsBrowser';
import CropEasyMulti from '@/components/crop/CropEasyMulti';
import CropEasySingle from '@/components/crop/CropEasySingle';
import SellersBrowser from '@/components/browsers/SellersBrowser';
import SubCategoriesBrowser from '@/components/browsers/SubCategoriesBrowser';

const View = ({params}) => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [formHeading, setFormHeading] = useState("");
  const [formSubHeading, setFormSubHeading] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const [editId, setEditId] = useState("");
  const [editStatus, setEditStatus] = useState('active');
  const [editStatusError, setEditStatusError] = useState(false);
  const [editPartNumber, setEditPartNumber] = useState("");
  const [editPartNumberError, setEditPartNumberError] = useState(false);
  const [editBarcode, setEditBarcode] = useState("");
  const [editBarcodeError, setEditBarcodeError] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editCodeError, setEditCodeError] = useState(false);
  const [editHeading, setEditHeading] = useState("");
  const [editHeadingError, setEditHeadingError] = useState(false);
  const [editShortDescription, setEditShortDescription] = useState("");
  const [editShortDescriptionError, setEditShortDescriptionError] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [editDescriptionError, setEditDescriptionError] = useState(false);

  const [editPrice, setEditPrice] = useState(0.0);
  const [editPriceError, setEditPriceError] = useState(false);
  const [editDiscount, setEditDiscount] = useState(0.0);
  const [editDiscountError, setEditDiscountError] = useState(false);
  const [editQuantityDiscountAmount, setEditQuantityDiscountAmount] = useState(0);
  const [editQuantityDiscountAmountError, setEditQuantityDiscountAmountError] = useState(false);
  const [editQuantityDiscount, setEditQuantityDiscount] = useState(0);
  const [editQuantityDiscountError, setEditQuantityDiscountError] = useState(false);
  const [editQuantityFreeIssueAmount, setEditQuantityFreeIssueAmount] = useState(0);
  const [editQuantityFreeIssueAmountError, setEditQuantityFreeIssueAmountError] = useState(false);
  const [editQuantityFreeIssue, setEditQuantityFreeIssue] = useState(0);
  const [editQuantityFreeIssueError, setEditQuantityFreeIssueError] = useState(false);
  const [editOrderTotalDiscountAmount, setEditOrderTotalDiscountAmount] = useState(0.0);
  const [editOrderTotalDiscountAmountError, setEditOrderTotalDiscountAmountError] = useState(false);
  const [editOrderTotalDiscount, setEditOrderTotalDiscount] = useState(0);
  const [editOrderTotalDiscountError, setEditOrderTotalDiscountError] = useState(false);
  const [editInhand, setEditInhand] = useState(0);
  const [editInhandError, setEditInhandError] = useState(false);
  const [editFeatured, setEditFeatured] = useState("no");
  const [editFeaturedError, setEditFeaturedError] = useState(false);
  const [editFreeShipping, setEditFreeShipping] = useState("no");
  const [editFreeShippingError, setEditFreeShippingError] = useState(false);

  const [editCategory, setEditCategory] = useState({id: 0, description: "Please Select"});
  const [editCategoryError, setEditCategoryError] = useState(false);
  const [editSubCategory, setEditSubCategory] = useState({id: 0, description: "Please Select"});
  const [editSubCategoryError, setEditSubCategoryError] = useState(false);
  const [editSeller, setEditSeller] = useState({id: 0, description: "Please Select"});
  const [editSellerError, setEditSellerError] = useState(false);
  const [editBrand, setEditBrand] = useState({id: 0, description: "Please Select"});
  const [editBrandError, setEditBrandError] = useState(false);
  const [editModel, setEditModel] = useState({id: 0, description: "Please Select", brandId: 0, brandDescription: "Please Select"});
  const [editModelError, setEditModelError] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const [openSeller, setOpenSeller] = useState(false);

  const [editImage, setEditImage] = useState("none");
  const [editImageError, setEditImageError] = useState(false);
  const [openCrop, setOpenCrop] = useState(false);  
  const imageRef = useRef();
  const [photoURL, setPhotoURL] = useState("none");

  const [editImages, setEditImages] = useState([]);
  const [editImagesError, setEditImagesError] = useState(false);
  const [editEditingImage, setEditEditingImage] = useState(-1);
  const [openOtherCrop, setOpenOtherCrop] = useState(false);
  const otherImageRef = useRef();
  const [otherPhotoURL, setOtherPhotoURL] = useState("none");

  const [editFeatures, setEditFeatures] = useState([]);
  const [editItemFeatures, setEditItemFeatures] = useState([]);

  useEffect(() => {
    if(status==='unauthenticated'){
      router.push("/signin");
    }
  }, [status]);

  useEffect(() => {
    setIsLoading(false);
    setIsSaving(false);
    if(params.id==="create-item"){
      setFormHeading("Create Item");
      setFormSubHeading("Create a new item");
    }
    else{
      setFormHeading("Edit Item");
      setFormSubHeading("Edit an existing item");
      loadItem(params.id);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const loadItem = async (id) => {
    setIsLoading(true);
    try{
      const response = await axios.post("/api/inventory/find", {
        id: id
      });
      let val = response.data.data;
      setEditId(val.id);
      setEditStatus(val.status);
      setEditPartNumber(val.part_number);
      setEditBarcode(val.barcode);
      setEditCode(val.code);
      setEditHeading(val.heading);
      setEditShortDescription(val.short_description);
      setEditDescription(val.description);

      setEditPrice(val.price);
      setEditDiscount(val.discount);
      setEditQuantityDiscountAmount(val.quantity_discount_amount);
      setEditQuantityDiscount(val.quantity_discount);
      setEditQuantityFreeIssueAmount(val.quantity_free_issue_amount);
      setEditQuantityFreeIssue(val.quantity_free_issue);
      setEditOrderTotalDiscountAmount(val.order_total_discount_amount);
      setEditOrderTotalDiscount(val.order_total_discount);
      setEditFeatured(val.featured);
      setEditFreeShipping(val.free_shipping);

      setEditSeller({id: val.seller_id, description: val.online_user.first_name+" "+val.online_user.last_name});
      setEditCategory({id: val.category_id, description: val.category.description});
      setEditSubCategory({id: val.sub_category_id, description: val.sub_category.description, category_id: val.category_id, category_description: val.category.description});
      setEditBrand({id: val.brand_id, description: val.brand.description});
      setEditModel({id: val.model_id, description: val.model.description, brand_id: val.brand_id, brand_description: val.brand.description});

      setEditInhand(val.inhand);

      if(val.image_url==="none"){
        setEditImage("none");
      }
      else{
        setEditImage(" http://localhost:8000/"+val.image_url);
      }

      var val1 = val.inventory_images;
      var val2 = [];
      val1.map(val3=>{
        val2.push({id: val3.id, inventoryId: val.id, imageUrl: " http://localhost:8000/"+val3.image_url});
      });
      setEditImages(val2);

      setEditItemFeatures(val.inventory_features);
      setIsSaving(false);
      getFeaturesForSubCategory(val.sub_category_id);
    }
    catch(error){
      console.log(error);
      toast.error("Find Item Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsLoading(false);
    }
  }

  const getFeaturesForSubCategory = async (id) => {
    try{
      setIsSaving(true);
      clearErrors();
      const response = await axios.post(`/api/features/find-for-sub-category`, {
        sub_category_id: parseInt(id),
      });
      if (!response.data.error) {
        setEditFeatures(response.data.data);
      } 
    }
    catch(error){
      toast.error("Get Features Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  const newItemClicked = () => {
    clearErrors();
    clearFields();
    setFormHeading("Create Item");
    setFormSubHeading("Create a new item");
    setTabIndex(0);
  }

  const clearErrors = () => {
    setEditStatusError(false);
    setEditPartNumberError(false);
    setEditBarcodeError(false);
    setEditCodeError(false);
    setEditCategoryError(false);
    setEditSubCategoryError(false);
    setEditSellerError(false);
    setEditBrandError(false);
    setEditModelError(false);
    setEditHeadingError(false);
    setEditShortDescriptionError(false);
    setEditDescriptionError(false);
    setEditPriceError(false);
    setEditDiscountError(false);
    setEditFeaturedError(false);
    setEditFreeShippingError(false);
    setEditInhandError(false);
    setEditQuantityDiscountAmountError(false);
    setEditQuantityDiscountError(false);
    setEditQuantityFreeIssueAmountError(false);
    setEditQuantityFreeIssueError(false);
    setEditOrderTotalDiscountAmountError(false);
    setEditOrderTotalDiscountError(false);
    setEditImageError(false);
    setEditImagesError(false);
    setServerError(false);
  };

  const clearFields = () => {
    setEditId('');
    setEditStatus('active');
    setEditPartNumber('');
    setEditBarcode('');
    setEditCode('');
    //setEditSeller({id: 0, description: "Please Select"});
    //setEditCategory({id: 0, description: "Please Select"});
    //setEditSubCategory({id: 0, description: "Please Select"});
    //setEditBrand({id: 0, description: "Please Select"});
    //setEditModel({id: 0, description: "Please Select", brand_id: 0, brand_description: "Please Select"});
    setEditHeading('');
    setEditShortDescription('');
    setEditDescription('');
    setEditPrice(0);
    setEditDiscount(0);
    //setEditFeatured("no");
    setEditFeatured("yes");
    setEditFreeShipping("no");
    setEditInhand(0);
    setEditQuantityDiscountAmount(0);
    setEditQuantityDiscount(0);
    setEditQuantityFreeIssueAmount(0);
    setEditQuantityFreeIssue(0);
    setEditOrderTotalDiscountAmount(0);
    setEditOrderTotalDiscount(0);
    setEditImage('none');
    setEditImages([]);
    setEditItemFeatures([]);
  };

  const saveClicked = async () => {
    try{
      setIsSaving(true);
      clearErrors();
      var error = false;
      if (editPartNumber.length===0 || editPartNumber.length>32) {
        error = true;
        setEditPartNumberError(true);
      }
      if (editBarcode.length>32) {
        error = true;
        setEditBarcodeError(true);
      }
      if (editCode.length>32) {
        error = true;
        setEditCodeError(true);
      }
      if (editCategory.id===0) {
        error = true;
        setEditCategoryError(true);
      }
      if (editSubCategory.id===0) {
        error = true;
        setEditSubCategoryError(true);
      }
      if (editSeller.id===0) {
        error = true;
        setEditSellerError(true);
      }
      if (editBrand.id===0) {
        error = true;
        setEditBrandError(true);
      }
      if (editModel.id===0) {
        error = true;
        setEditModelError(true);
      }
      if (editHeading.length===0 || editHeading.length>128) {
        error = true;
        setEditHeadingError(true);
      }      
      if (editShortDescription.length===0 || editShortDescription.length>256) {
        error = true;
        setEditShortDescriptionError(true);
      }
      if (editDescription.length>2048) {
        error = true;
        setEditDescriptionError(true);
      }
      if(!error){
        var apiDes = "";
        if(editId===""){
          apiDes = "create";
        }
        else{
          apiDes = "edit";
        }
        const response = await axios.post(`/api/inventory/${apiDes}`, {
          id: parseInt(editId),
          seller_id: editSeller.id,
          status: editStatus,
          part_number: editPartNumber,
          barcode: editBarcode,
          code: editCode,
          category_id: editCategory.id,
          sub_category_id: editSubCategory.id,
          brand_id: editBrand.id,
          model_id: editModel.id,
          heading: editHeading,
          short_description: editShortDescription,
          description: editDescription,
          price: editPrice,
          discount: editDiscount,
          free_shipping: editFreeShipping,
          featured: editFeatured,
          inhand: editInhand,
          quantity_discount_amount: editQuantityDiscountAmount,
          quantity_discount: editQuantityDiscount,
          quantity_free_issue_amount: editQuantityFreeIssueAmount,
          quantity_free_issue: editQuantityFreeIssue,
          order_total_discount_amount: editOrderTotalDiscountAmount,
          order_total_discount: editOrderTotalDiscount,
          shipping_charges_local: 0.0,
          shipping_charges_international: 0.0,
        });
        if(editId===""){
          setEditId(response.data.data.id);
          toast.success("Item Created !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
        else{
          toast.success("Item Edited !", {
            position: toast.POSITION.TOP_RIGHT
          });
        }
      }
    }
    catch(error){
      toast.error("Item Create Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  const handleImageRemove = (event) => {
    setPhotoURL("none");
    deleteImage();
  }

  const deleteImage = async () => {
    if(editId!==""){
      setIsSaving(true);
      try{
        const response = await axios.post("/api/inventory/delete-main-image", {
          id: parseInt(editId),
        });
        setEditImage("none");
      }
      catch(error){
        
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const handleImageChange = (event) => {
    const file1 = event.target.files[0];
    if(file1){
      setPhotoURL(URL.createObjectURL(file1));
      setOpenCrop(true);
    }
  }

  const selectSingleImage = (fileIn, url) => {
    if(editId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("id", ""+editId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: " http://localhost:8000/inventory/edit-main-image-web",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.error) {
          setServerError(true);
          toast.error("Image Upload Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
          setIsSaving(false);
        } 
        else {
          setEditImage(" http://localhost:8000/"+response.data.data);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  }

  const handleOtherImageRemove = (event, id) => {
    deleteOtherImage(id);
  }

  const deleteOtherImage = async (id) => {
    if(editId!==""){
      setIsSaving(true);
      setEditEditingImage(id);
      try{
        const response = await axios.post("/api/inventory/delete-other-image", {
          id: id,
        });
        if(response.data.data.response==="ok"){
          let filteredArray = editImages.filter(item => item.id !== response.data.data.id);
          setEditImages(filteredArray);
        }
        setEditEditingImage(-1);
      }
      catch(error){
        toast.error("Image Delete Failed !", {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      finally{
        setIsSaving(false);
      }
    }
  }

  const handleOtherImageChange = (event, id) => {
    const file1 = event.target.files[0];
    if(file1){
      setEditEditingImage(id);
      setOtherPhotoURL(URL.createObjectURL(file1));
      setOpenOtherCrop(true);
    }
  }

  const selectMultiImage = (fileIn, url) => {
    if(editId!==""){
      setIsSaving(true);
      const formData = new FormData();
      formData.append("inventoryId", ""+editId);
      formData.append('imageUrl', fileIn);
      axios({
        method: "post",
        url: " http://localhost:8000/inventory/edit-other-image-web",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(function (response) {
        if (response.data.error) {
          setServerError(true);
          toast.error("Image Upload Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
          setIsSaving(false);
        } 
        else {
          let val = [...editImages];
          val.push({id: response.data.data.data.id, inventoryId: parseInt(editId), imageUrl: " http://localhost:8000/"+response.data.data.data.image_url});
          setEditImages(val);
          setOtherPhotoURL("none");
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        setIsSaving(false);
      });
    }
  }

  const subFeatureAdded = async (value, type, featureId) => {
    try{
      setIsSaving(true);
      clearErrors();
      if(type==="single"){
        const response = await axios.post(`/api/inventory/add-single-feature`, {
          inventory_id: parseInt(editId),
          feature_id: featureId,
          sub_feature_id: parseInt(value),
        });
        if (response.data.error) {
          setServerError(true);
          toast.error("Add Feature Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        } 
        else{
          let filteredArray = editItemFeatures.filter(val2=>val2.feature_id!==parseInt(featureId));
          filteredArray.push({feature_id: featureId, sub_feature_id: parseInt(value)});
          setEditItemFeatures(filteredArray);
        }
      }
      else if(type==="multiple"){
        const index = editItemFeatures.findIndex(val2=>val2.sub_feature_id===parseInt(value));
        if(index>-1){
          const response = await axios.post(`/api/inventory/remove-multiple-feature`, {
            inventory_id: parseInt(editId),
            feature_id: featureId,
            sub_feature_id: parseInt(value),
          });
          if (response.data.error) {
            setServerError(true);
            toast.error("Add Feature Failed !", {
              position: toast.POSITION.TOP_RIGHT
            });
          } 
          else{
            let filteredArray = editItemFeatures.filter(val2=>val2.sub_feature_id!==parseInt(value));
            setEditItemFeatures(filteredArray);
          }
        }
        else{
          const response = await axios.post(`/api/inventory/add-multiple-feature`, {
            inventory_id: parseInt(editId),
            feature_id: featureId,
            sub_feature_id: parseInt(value),
          });
          if (response.data.error) {
            setServerError(true);
            toast.error("Add Feature Failed !", {
              position: toast.POSITION.TOP_RIGHT
            });
          } 
          else{
            let val1 = [...editItemFeatures];
            val1.push({feature_id: featureId, sub_feature_id: parseInt(value)});
            setEditItemFeatures(val1);
          }
        }
      }
    }
    catch(error){
      toast.error("Add Feature Failed !", {
        position: toast.POSITION.TOP_RIGHT
      });
    }
    finally{
      setIsSaving(false);
    }
  }

  const removeAllFeatures = async () => {
    if(editId!==""){
      try {
        setIsSaving(true);
        const response = await axios.post(`/api/inventory/remove-all-features`, {
          inventory_id: parseInt(editId),
        });
        if (response.data.error) {
          setServerError(true);
          toast.error("Remove All Features Failed !", {
            position: toast.POSITION.TOP_RIGHT
          });
        } 
        else{
          setEditItemFeatures([]);
          if(editSubCategory.id>0){
            getFeaturesForSubCategory(editSubCategory.id);
          }
          else{
            setEditFeatures([]);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSaving(false);
      }
    }
    else{
      setEditItemFeatures([]);
    }
  }

  const openSubCategoryClicked = () => {
    setEditCategoryError(false);
    if(editCategory.id>0){
      setOpenSubCategory(true);
    }
    else{
      setEditCategoryError(true);
    }
  }

  const openBrandClicked = () => {
    setEditSubCategoryError(false);
    if(editSubCategory.id>0){
      setOpenBrand(true);
    }
    else{
      setEditSubCategoryError(true);
    }
  }

  const openModelClicked = () => {
    setEditBrandError(false);
    if(editBrand.id>0){
      setOpenModel(true);
    }
    else{
      setEditBrandError(true);
    }
  }

  useEffect(() => {
    setEditCategoryError(false);
    if(!isSaving){
      setEditSubCategory({id: 0, description: "Please Select"});
      setEditBrand({id: 0, description: "Please Select"});
    }
  }, [editCategory]);

  useEffect(() => {
    setEditSubCategoryError(false);
    if(!isSaving){
      setEditBrand({id: 0, description: "Please Select"});
      removeAllFeatures();
    }
  }, [editSubCategory]);

  useEffect(() => {
    if(!isSaving){
      setEditModel({id: 0, description: "Please Select"});
    }    
  }, [editBrand]);

  useEffect(() => {
    setEditModelError(false);
  }, [editModel]);
  

  return (
    <div className='form_container' style={{minHeight: (height-80)}}>
      <div className='form_container_medium' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <IconButton onClick={()=>router.push('/inventory')} sx={{backgroundColor: '#27272a', "&:hover, &.Mui-focusVisible": {backgroundColor: "#52525b"}}}><KeyboardArrowLeft sx={{width: 30, height: 30, color: '#ffffff'}}/></IconButton>
            <div className='header_container_left_text'>
              <span className="form_header">{formHeading}</span>
              <span className="form_sub_header">{formSubHeading}</span>
            </div>
          </div>
          <div className='header_container_right'>
            <Button 
              variant='outlined' 
              disabled={isSaving||isLoading} 
              style={{textTransform: 'none'}} 
              startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Add />}
              onClick={()=>newItemClicked()}
              size='small'
            >Create</Button>
            <Button 
              variant='contained' 
              disabled={isSaving||isLoading} 
              style={{textTransform: 'none'}} 
              startIcon={isSaving||isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Save />}
              onClick={()=>saveClicked()}
              size='small'
            >Save</Button>
          </div>
        </div>
        <Tabs value={tabIndex} onChange={handleTabChange} centered >
          <Tab label="Details" />
          <Tab label="Price" />
          <Tab label="Images" disabled={editId===""} />
          <Tab label="Features" disabled={editId===""} />
        </Tabs>
        {tabIndex===0 &&
          <div className='form_fields_container_search mt-4'>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <TextField 
                  id='id'
                  label="ID" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editId} 
                  disabled={true}
                  size='small' 
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
              </div>
              <div className='form_field_container'>
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Seller</span>
                  <span className='form_text_field_constructed_text' onClick={()=>setOpenSeller(true)}>{editSeller.description}</span>
                  <div className='form_text_field_constructed_actions_1'>
                    <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenSeller(true)}/>
                  </div>
                </div>
                {editSellerError && <span className='form_error_floating'>Invalid Seller</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='code'
                  label="Code" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editCode} 
                  error={editCodeError}
                  onChange={event=>setEditCode(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditCodeError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editCodeError && <span className='form_error_floating'>Invalid Code</span>}
              </div>
              <div className='form_field_container'>
                <TextField className='form_text_field'
                  id='status'
                  value={editStatus}
                  label="Status"
                  onChange={event=>setEditStatus(event.target.value)} 
                  variant={"outlined"}
                  select={true}
                  disabled={isLoading}
                  size='small'
                  onFocus={()=>setEditStatusError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                >
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"inactive"}>Inactive</MenuItem>
                </TextField>
                {editStatusError && <span className='form_error_floating'>Invalid Status</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='part-number'
                  label="Part Number" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editPartNumber} 
                  error={editPartNumberError}
                  onChange={event=>setEditPartNumber(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditPartNumberError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editPartNumberError && <span className='form_error_floating'>Invalid Part Number</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='barcode'
                  label="Barcode" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editBarcode} 
                  error={editBarcodeError}
                  onChange={event=>setEditBarcode(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditBarcodeError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editBarcodeError && <span className='form_error_floating'>Invalid Barcode</span>}
              </div>
            </div>
            <div className='form_row_double'>              
              <div className='form_field_container'>              
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Category</span>
                  <span className='form_text_field_constructed_text' onClick={()=>setOpenCategory(true)}>{editCategory.description}</span>
                  <div className='form_text_field_constructed_actions_1'>
                    <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenCategory(true)}/>
                  </div>
                </div>
                {editCategoryError && <span className='form_error_floating'>Invalid Category</span>}
              </div>
              <div className='form_field_container'>              
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Sub Category</span>
                  <span className='form_text_field_constructed_text' onClick={openSubCategoryClicked}>{editSubCategory.description}</span>
                  <div className='form_text_field_constructed_actions_1'>
                    <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={openSubCategoryClicked}/>
                  </div>
                </div>
                {editSubCategoryError && <span className='form_error_floating'>Invalid Sub Category</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Brand</span>
                  <span className='form_text_field_constructed_text' onClick={openBrandClicked}>{editBrand.description}</span>
                  <div className='form_text_field_constructed_actions_1'>
                    <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={openBrandClicked}/>
                  </div>
                </div>
                {editBrandError && <span className='form_error_floating'>Invalid Brand</span>}
              </div>
              <div className='form_field_container'>
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Model</span>
                  <span className='form_text_field_constructed_text' onClick={openModelClicked}>{editModel.description}</span>
                  <div className='form_text_field_constructed_actions_1'>
                    <ArrowDropDown sx={{width: 22, height: 22, color: '#6b7280'}} onClick={openModelClicked}/>
                  </div>
                </div>
                {editModelError && <span className='form_error_floating'>Invalid Model</span>}
              </div>
            </div>
            <div className='form_row_single'>
              <div className='form_field_container_full'>
                <TextField 
                  id='heading'
                  label="Heading" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editHeading} 
                  error={editHeadingError}
                  onChange={event=>setEditHeading(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditHeadingError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editHeadingError && <span className='form_error_floating'>Invalid Heading</span>}
              </div>
            </div>
            <div className='form_row_single'>
              <div className='form_field_container_full'>
                <TextField 
                  id='short-description'
                  label="Short Description" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editShortDescription} 
                  error={editShortDescriptionError}
                  onChange={event=>setEditShortDescription(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  onFocus={()=>setEditShortDescriptionError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editShortDescriptionError && <span className='form_error_floating'>Invalid Short Description</span>}
              </div>
            </div>
            <div className='form_row_single'>
              <div className='form_field_container_full'>
                <TextField 
                  id='description'
                  label="Description" 
                  variant="outlined" 
                  className='form_text_field' 
                  value={editDescription} 
                  error={editDescriptionError}
                  onChange={event=>setEditDescription(event.target.value)}
                  disabled={isSaving||isLoading}
                  size='small' 
                  multiline={true}
                  rows={8}
                  onFocus={()=>setEditDescriptionError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editDescriptionError && <span className='form_error_floating'>Invalid Description</span>}
              </div>
            </div>
          </div>
        }
        {tabIndex===1 &&
          <div className='form_fields_container_search mt-4'>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='price'
                  type='number'
                  label="Price" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={parseFloat(editPrice).toFixed(2)} 
                  error={editPriceError}
                  onChange={event=>setEditPrice(event.target.value)}
                  disabled={isSaving||isLoading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>Rs.</span></InputAdornment>,
                  }}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditPriceError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}                  
                />
                {editPriceError && <span className='form_error_floating'>Invalid Price</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='discount'
                  type='number'
                  label="Discount %" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editDiscount} 
                  error={editDiscountError}
                  onChange={event=>setEditDiscount(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditDiscountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editDiscountError && <span className='form_error_floating'>Invalid Discount</span>}
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Featured</span>
                  <div className='w-full flex flex-row justify-end items-center'>
                    <FormControlLabel disabled={isSaving||isLoading} sx={{fontSize: 12}} value="yes" checked={editFeatured==="yes"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                    <FormControlLabel disabled={isSaving||isLoading} value="no" checked={editFeatured==="no"} onChange={(e)=>setEditFeatured(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                  </div>
                  {editFeaturedError && <span className='form_error_floating'>Invalid Featured</span>}
                </div>
              </div>
              <div className='form_field_container'>
                <div className='form_text_field_constructed'>
                  <span className='form_text_field_constructed_label'>Free Shipping</span>
                  <div className='w-full flex flex-row justify-end items-center'>
                    <FormControlLabel disabled={isSaving||isLoading} value="yes" checked={editFreeShipping==="yes"} onChange={(e)=>setEditFreeShipping(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"Yes"}</span>} />
                    <FormControlLabel disabled={isSaving||isLoading} value="no" checked={editFreeShipping==="no"} onChange={(e)=>setEditFreeShipping(e.target.value)} control={<Radio />} label={<span className='text-xs'>{"No"}</span>} />
                  </div>
                  {editFreeShippingError && <span className='form_error_floating'>Invalid Free Shipping</span>}
                </div>
              </div>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'></div>
              <div className='form_field_container'>
                <TextField 
                  id='inhand'
                  type='number'
                  label="Inhand" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editInhand} 
                  error={editInhandError}
                  onChange={event=>setEditInhand(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditInhandError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editInhandError && <span className='form_error_floating'>Invalid Inhand</span>}
              </div>
            </div>
            <div className='form_row_single_left'>
              <span className="form_internal_header">Quantity Discount</span>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-discount-amount'
                  type='number'
                  label="Amount" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editQuantityDiscountAmount} 
                  error={editQuantityDiscountAmountError}
                  onChange={event=>setEditQuantityDiscountAmount(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditQuantityDiscountAmountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                  
                />
                {editQuantityDiscountAmountError && <span className='form_error_floating'>Invalid Amount</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-discount'
                  type='number'
                  label="Discount %" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editQuantityDiscount} 
                  error={editQuantityDiscountError}
                  onChange={event=>setEditQuantityDiscount(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditQuantityDiscountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editQuantityDiscountError && <span className='form_error_floating'>Invalid Discount</span>}
              </div>
            </div>
            <div className='form_row_single_left'>
              <span className="form_internal_header">Free Issue</span>
            </div>
            <div className='form_row_double'>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-free-issue-amount'
                  type='number'
                  label="Amount" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editQuantityFreeIssueAmount} 
                  error={editQuantityFreeIssueAmountError}
                  onChange={event=>setEditQuantityFreeIssueAmount(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditQuantityFreeIssueAmountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                  
                />
                {editQuantityFreeIssueAmountError && <span className='form_error_floating'>Invalid Amount</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-free-issue'
                  type='number'
                  label="Discount %" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editQuantityFreeIssue} 
                  error={editQuantityFreeIssueError}
                  onChange={event=>setEditQuantityFreeIssue(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditQuantityFreeIssueError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editQuantityFreeIssueError && <span className='form_error_floating'>Invalid Free Issue</span>}
              </div>
            </div>
            <div className='form_row_single_left'>
              <span className="form_internal_header">Order Total Discount</span>
            </div>
            <div className='form_row_double mb-5'>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-free-issue-amount'
                  type='number'
                  label="Amount" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={parseFloat(editOrderTotalDiscountAmount).toFixed(2)} 
                  error={editOrderTotalDiscountAmountError}
                  onChange={event=>setEditOrderTotalDiscountAmount(event.target.value)}
                  disabled={isSaving||isLoading}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><span style={{fontSize: 13}}>Rs.</span></InputAdornment>,
                  }}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditOrderTotalDiscountAmountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editOrderTotalDiscountAmountError && <span className='form_error_floating'>Invalid Amount</span>}
              </div>
              <div className='form_field_container'>              
                <TextField 
                  id='quantity-free-issue'
                  type='number'
                  label="Discount %" 
                  variant="outlined" 
                  className='form_text_field_right' 
                  value={editOrderTotalDiscount} 
                  error={editOrderTotalDiscountError}
                  onChange={event=>setEditOrderTotalDiscount(event.target.value)}
                  disabled={isSaving||isLoading}
                  sx={{input: {textAlign: "right"}}}
                  size='small' 
                  onFocus={()=>setEditOrderTotalDiscountError(false)}
                  inputProps={{style: {fontSize: 13}}}
                  SelectProps={{style: {fontSize: 13}}}
                  InputLabelProps={{style: {fontSize: 15}}}
                />
                {editOrderTotalDiscountError && <span className='form_error_floating'>Invalid Discount</span>}
              </div>
            </div>
          </div>
        }
        {tabIndex===2 &&
          <>
            <div className='form_fields_container_search mt-4'>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Main Image</span>
              </div>
              <div className='inventory_image_container'>
                <div className='flex justify-center items-center w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] relative'>
                  {editImage==="none" ? 
                    <CameraAlt sx={{width: 120, height: 120, color: '#cbd5e1'}}/> : 
                    <Image src={editImage} alt="product image" fill sizes='(max-width: 640px) 280px, 400px' priority={true} style={{objectFit: 'cover'}}/>
                  }
                  <input type='file' ref={imageRef} onChange={handleImageChange} className='file_input'/>
                </div>
                <div className='inventory_image_controls mt-2'>
                  <IconButton disabled={isSaving||isLoading} onClick={()=>imageRef.current.click()}><Folder sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                  <IconButton disabled={isSaving||isLoading} onClick={(event)=>handleImageRemove(event)}><Delete sx={{width: 20, height: 20, color: '#7c3aed'}}/></IconButton>
                </div>
              </div>
            </div>
            <div className='form_fields_container mt-3'>
              <div className='form_row_single_left'>
                <span className="form_internal_header">Other Images</span>
              </div>
              <div className='w-full flex flex-row justify-center items-start flex-wrap gap-2'>
                <input type='file' ref={otherImageRef} onChange={(event)=>handleOtherImageChange(event, -1)} className='file_input'/>
                <div className='flex justify-center items-center w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] relative bg-slate-100 border-slate-300 border rounded cursor-pointer' onClick={()=>otherImageRef.current.click()}>
                  <AddAPhoto sx={{width: 50, height: 50, color: '#cbd5e1'}}/>
                </div>
                {editImages.map(val=>
                  <div key={val.imageUrl} className='flex justify-center items-center w-[150px] sm:w-[180px] h-[150px] sm:h-[180px] relative'>
                    <Image src={val.imageUrl} alt="product image" fill sizes='(max-width: 640px) 150px, 180px' priority={true} style={{objectFit: 'cover'}}/>
                    <IconButton sx={{position: 'absolute', top: 5, right: 5, backgroundColor: '#7c3aed', "&:hover, &.Mui-focusVisible": {backgroundColor: "#5b21b6"}, opacity: 0.5}} disabled={isSaving&&editEditingImage===val.id} onClick={(event)=>handleOtherImageRemove(event, val.id)}>
                      {isSaving && editEditingImage===val.id ? 
                        <CircularProgress size={16} style={{'color': '#9ca3af'}}/>:
                        <Delete style={{'color': '#ffffff', width: 16, height: 16}}/>
                      }
                    </IconButton>
                  </div>
                )}
              </div>
            </div>
          </>
        }
        {tabIndex===3 &&
          <div className='form_fields_container_search mt-4'>
            <div className='flex flex-col mb-7'>
              <span className="form_internal_header">Add / Remove Features</span>
            </div>
            {editFeatures.map(val=>
              <div key={val.feature.id} className='flex flex-col w-full mb-5'>
                <div className='flex flex-row justify-start items-center'>
                  <div className='flex justify-center items-center w-[26px] h-[26px] rounded-[13px] relative overflow-hidden'>
                    {val.feature.image_url==="none" ? 
                      <CameraAlt sx={{width: 26, height: 26, color: '#cbd5e1'}}/> : 
                      <Image src={" http://localhost:8000/"+val.feature.image_url} alt="feature image" fill sizes='26px' priority={true} style={{objectFit: 'cover'}}/>
                    }
                  </div>
                  <span className="text-sm mb-1 ml-3">{val.feature.description}</span>
                </div>
                <div className='flex flex-row justify-start items-center w-full flex-wrap gap-2 px-5'>
                  {val.feature.type==="single" && 
                    val.feature.sub_features.map(val1=>
                      <FormControlLabel key={val1.id} id={'sub-feature-'+val1.id} disabled={isSaving||isLoading}
                        value={val1.id} checked={editItemFeatures.findIndex(val2=>val2.sub_feature_id===val1.id)>-1}
                        onChange={(event)=>subFeatureAdded(event.target.value, val.feature.type, val.feature.id)}
                        control={<Radio/>} 
                        label={
                          <div className='flex flex-row justify-start items-center w-[160px] overflow-hidden'>
                            <div className='flex justify-center items-center w-[26px] h-[26px] rounded-[13px] relative overflow-hidden'>
                              {val1.image_url==="none" ? 
                                <CameraAlt sx={{width: 26, height: 26, color: '#cbd5e1'}}/> : 
                                <Image src={" http://localhost:8000/"+val1.image_url} alt="feature image" fill sizes='26px' priority={true} style={{objectFit: 'cover'}}/>
                              }
                            </div>
                            <span className="text-sm mb-1 ml-3">{val1.description}</span>
                          </div>
                        }
                      />
                    )
                  }
                  {val.feature.type==="multiple" && 
                    val.feature.sub_features.map(val1=>
                      <FormControlLabel key={val1.id} id={'sub-feature-'+val1.id} disabled={isSaving||isLoading}
                        value={val1.id} checked={editItemFeatures.findIndex(val2=>val2.sub_feature_id===val1.id)>-1}
                        onChange={(event)=>subFeatureAdded(event.target.value, val.feature.type, val.feature.id)}
                        control={<Checkbox/>} 
                        label={
                          <div className='flex flex-row justify-start items-center w-[160px] overflow-hidden'>
                            <div className='flex justify-center items-center w-[26px] h-[26px] rounded-[13px] relative overflow-hidden'>
                              {val1.image_url==="none" ? 
                                <CameraAlt sx={{width: 26, height: 26, color: '#cbd5e1'}}/> : 
                                <Image src={" http://localhost:8000/"+val1.image_url} alt="feature image" fill sizes='26px' priority={true} style={{objectFit: 'cover'}}/>
                              }
                            </div>
                            <span className="text-sm mb-1 ml-3">{val1.description}</span>
                          </div>
                        }
                      />
                    )
                  }
                </div>
              </div>
            )}
          </div>
        }
      </div>
      <Dialog open={openSeller} onClose={()=>setOpenSeller(false)} scroll='paper'>
        <SellersBrowser {...{setOpen: setOpenSeller, value: editSeller, setValue: setEditSeller}}/>
      </Dialog>
      <Dialog open={openCategory} onClose={()=>setOpenCategory(false)} scroll='paper'>
        <CategoriesBrowser {...{setOpen: setOpenCategory, value: editCategory, setValue: setEditCategory}}/>
      </Dialog>
      <Dialog open={openSubCategory} onClose={()=>setOpenSubCategory(false)} scroll='paper'>
        <SubCategoriesBrowser {...{setOpen: setOpenSubCategory, value: editSubCategory, setValue: setEditSubCategory, dependedValue: editCategory, setDependedValue: setEditCategory}}/>
      </Dialog>
      <Dialog open={openBrand} onClose={()=>setOpenBrand(false)} scroll='paper'>
        <BrandsBrowser {...{setOpen: setOpenBrand, value: editBrand, setValue: setEditBrand, category: editCategory, subCategory: editSubCategory}}/>
      </Dialog>
      <Dialog open={openModel} onClose={()=>setOpenModel(false)} scroll='paper'>
        <ModelsBrowser {...{setOpen: setOpenModel, value: editModel, setValue: setEditModel, dependedValue: editBrand, setDependedValue: setEditBrand}}/>
      </Dialog>
      <Dialog open={openCrop} onClose={()=>setOpenCrop(false)}>
        <CropEasySingle {...{setOpenCrop: setOpenCrop, photoURL: photoURL, selectSingleImage}}/>
      </Dialog>
      <Dialog open={openOtherCrop} onClose={()=>setOpenOtherCrop(false)}>
        <CropEasyMulti {...{setOpenCrop: setOpenOtherCrop, photoURL: otherPhotoURL, selectMultiImage}}/>
      </Dialog>
      <ToastContainer />
      {isLoading && <Loading height={(height-70)}/>}
    </div>
  )
}

export default View;