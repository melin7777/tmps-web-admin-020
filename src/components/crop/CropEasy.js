import { Cancel, Crop as CropIcon } from "@mui/icons-material";
import { DialogActions, DialogContent,Box, Typography, Slider, Button, DialogContentText } from "@mui/material";
import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/CropImage";

const CropEasy = ({setOpenCrop, photoURL, setPhotoURL, setFile}) => {
  const [crop, setCrop] = useState({x:0, y:0});
  const [zoom, setZoom] = useState(1);
  const [rotaion, setRotation] = useState(0);
  const [croppedAriaPixels, setCroppedAriaPixels] = useState(null);  

  const cropComplete = (croppedAria, croppedAriaPixels) => {
    setCroppedAriaPixels(croppedAriaPixels);
  }

  const cropImage = async () => {
    try{
      const {file, url} = await getCroppedImg(photoURL, croppedAriaPixels, rotaion);
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
    }
    catch(error){

    }
  }

  const cropCancel = async () => {
    try{
      setOpenCrop(false);
    }
    catch(error){

    }
  }

  return (
    <>
      <DialogContentText sx={{mx: 1, my: 1}}>Profile Image</DialogContentText>
      <DialogContent dividers sx={{background: '#333', position: 'relative', height: 400, width: 'auto', minWidth: {sm: 500}}}>
        <Cropper 
          image={photoURL} 
          crop={crop} 
          zoom={zoom} 
          zoomWithScroll={true}
          rotation={rotaion} 
          aspect={1} 
          cropShape="round"
          showGrid={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{flexDirection: 'column', mx: 3, my: 2}}>
        <Box sx={{width: '100%', mb: 1}}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider 
              valueLabelDisplay="auto" 
              valueLabelFormat={zoomPercent}
              min={1}
              max={10}
              step={1}
              value={zoom}
              onChange={(e, zoom)=>setZoom(zoom)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotaion}</Typography>
            <Slider 
              valueLabelDisplay="auto" 
              min={0}
              max={360}
              value={rotaion}
              onChange={(e, rotaion)=>setRotation(rotaion)}
            />
          </Box>
        </Box>
        <Box sx={{display: 'flex', gap: 2, flexWrap: 'wrap'}}>
          <Button variant="outlined" startIcon={<Cancel/>} onClick={cropCancel}>Cancel</Button>
          <Button variant="outlined" startIcon={<CropIcon/>} onClick={cropImage}>Crop</Button>
        </Box>
      </DialogActions>
    </>
  )
}

export default CropEasy;

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`;
}