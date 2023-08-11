import { DateCalendar } from "@mui/x-date-pickers";

const DateBrowser = ({setOpen, value, setValue}) => {

  return (
    <DateCalendar value={value} onChange={(val)=>{setValue(val);setOpen(false)}} />
  )
}

export default DateBrowser;