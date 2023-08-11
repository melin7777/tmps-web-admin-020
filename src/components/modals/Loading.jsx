import { CircularProgress } from "@mui/material";

const Loading = ({height}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-700 opacity-30 absolute w-full z-10" style={{height: height}}>
      <div className="flex flex-col items-center justify-center bg-white rounded" style={{height: 200, width: 300}}>
        <CircularProgress size={30} style={{color:"#000"}} />
        <span className="text-sm mt-5 font-semibold text-gray-700">Loading...</span>
      </div>
    </div>
  )
}

export default Loading;