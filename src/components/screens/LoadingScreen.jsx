import { CircularProgress } from "@mui/material";

const LoadingScreen = ({height}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full" style={{height: height}}>
      <CircularProgress size={30} style={{color:"#000"}} />
      <span className="text-sm mt-5 font-semibold text-gray-700">Loading...</span>
    </div>
  )
}

export default LoadingScreen;