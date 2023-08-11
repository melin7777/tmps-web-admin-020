'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from "axios";
import Loading from '@/components/modals/Loading';
import useWindowDimensions from '@/hooks/useWindowDimension';
import { CalendarMonth, Search } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, MenuItem, TextField } from '@mui/material';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, sub, lightFormat, format, parseISO, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, isEqual, subDays, isWithinInterval } from 'date-fns';
import DateBrowser from '@/components/browsers/DateBrowser';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Dashboard = () => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const { width, height } = useWindowDimensions();

  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: "Amount (Rs.)",
        margin: 20,
      },
    },
    colors: ['#FB8833'],
    series: [
      {
        name: 'Sales',
        data: []
      },
    ],
    credits: {
      enabled: false
    },
    accessibility: {
      enabled: false,
    }
  });
  const [chartOptionsDeliveries, setChartOptionsDeliveries] = useState({
    chart: {
      type: 'column'
    },
    title: {
      text: ''
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: "Amount (Rs.)",
        margin: 20,
      },
    },
    colors: ['#dc38d1'],
    series: [
      {
        name: 'Deliveries',
        data: []
      },
    ],
    credits: {
      enabled: false
    },
    accessibility: {
      enabled: false,
    }
  });
  const [openStartDate, setOpenStartDate] = useState(false);
  const [searchStartDate, setSearchStartDate] = useState(new Date());
  const [openEndDate, setOpenEndDate] = useState(false);
  const [searchEndDate, setSearchEndDate] = useState(new Date());
  const [searchEndDateView, setSearchEndDateView] = useState("");
  const [searchStartDateView, setSearchStartDateView] = useState("");
  const [searchTimeFrame, setSearchTimeFrame] = useState("this_month");
  const [searchTimePeriod, setSearchTimePeriod] = useState("weekly");
  const [searchData, setSearchData] = useState([]);
  const [searchDataDeliveries, setSearchDataDeliveries] = useState([]);
  const [searchTotal, setSearchTotal] = useState(0.0);
  const [searchDiscount, setSearchDiscount] = useState(0.0);
  const [searchNetTotal, setSearchNetTotal] = useState(0.0);
  const [searchTotalDeliveries, setSearchTotalDeliveries] = useState(0.0);
  const [searchDiscountDeliveries, setSearchDiscountDeliveries] = useState(0.0);
  const [searchNetTotalDeliveries, setSearchNetTotalDeliveries] = useState(0.0);

  useEffect(() => {
    if(session && session.user && status!=="loading"){
      if(session.user.status==="activation_pending"){
        router.push("/signup");
      }
      else if(session.user.status==="incomplete"){
        router.push("/signup");
      }
      else if(session.user.status==="reset_pending"){
        router.push("/reset");
      }
      else{
        setLoading(false);
      }
    }
    else{
      if(status==="unauthenticated"){
        router.push("/signin");
      }
    }
  }, [status]);

  useEffect(() => {
    setSearchStartDateView(format(searchStartDate, "yyyy-MM-dd"));
  }, [searchStartDate]);

  useEffect(() => {
    setSearchEndDateView(format(searchEndDate, "yyyy-MM-dd"));
  }, [searchEndDate]);
  
  useEffect(() => {
    if(searchTimeFrame==="this_week"){
      setSearchStartDate(startOfWeek(new Date(), { weekStartsOn: 1 }));
      setSearchEndDate(endOfWeek(new Date(), { weekStartsOn: 1 }));
    }
    else if(searchTimeFrame==="this_month"){
      setSearchStartDate(startOfMonth(new Date()));
      setSearchEndDate(endOfMonth(new Date()));
    }
    else if(searchTimeFrame==="this_year"){
      setSearchStartDate(startOfYear(new Date()));
      setSearchEndDate(endOfYear(new Date()));
    }
    else if(searchTimeFrame==="last_week"){
      var date1 = sub(new Date(), {weeks: 1});
      setSearchStartDate(startOfWeek(date1, {weekStartsOn: 1}));
      setSearchEndDate(endOfWeek(date1, {weekStartsOn: 1}));
    }
    else if(searchTimeFrame==="last_month"){
      var date1 = sub(new Date(), {months: 1});
      setSearchStartDate(startOfMonth(date1));
      setSearchEndDate(endOfMonth(date1));
    }
    else if(searchTimeFrame==="last_3_months"){
      var date1 = sub(new Date(), {months: 1});
      var date2 = sub(date1, {months: 2});
      setSearchStartDate(startOfMonth(date2));
      setSearchEndDate(endOfMonth(date1));
    }
    else if(searchTimeFrame==="last_6_months"){
      var date1 = sub(new Date(), {months: 1});
      var date2 = sub(date1, {months: 5});
      setSearchStartDate(startOfMonth(date2));
      setSearchEndDate(endOfMonth(date1));
    }
    else if(searchTimeFrame==="last_year"){
      var date1 = sub(new Date(), {years: 1});
      setSearchStartDate(startOfYear(date1));
      setSearchEndDate(endOfYear(date1));
    }
    else if(searchTimeFrame==="last_3_years"){
      var date1 = sub(new Date(), {years: 1});
      var date2 = sub(date1, {years: 2});
      setSearchStartDate(startOfYear(date2));
      setSearchEndDate(endOfYear(date1));
    }
    getSearchData();
  }, [searchTimeFrame]);

  async function getSearchData(){
    setIsLoading(true);
    setServerError(false);
    try{
      var error = false;
      var search_data = {};
      search_data["seller_id"] = (session.user.id);
      search_data["from_date"] = searchStartDateView;
      search_data["to_date"] = searchEndDateView;
      if(!error){
        const response = await axios.post("/api/orders/summary", {
          search_data: search_data,
        });
        var val = response.data.data.data;
        var index = 1;
        var total_all = 0.0;
        var discount_all = 0.0;
        var net_total_all = 0.0;
        const values = [];
        val.map(val1 => {
          var total = 0.0;
          var discount = 0.0;
          var net_total = 0.0;
          val1.orders_items.map(val2=>{
            total = total + (val2.price*val2.quantity);
            discount = discount + val2.discount;
            net_total = net_total + val2.sub_total;
          });
          total_all = total_all + total;
          discount_all = discount_all + discount;
          net_total_all = net_total_all + net_total;
          const temp = {
            index: index++,
            id: val1.id,
            u_date: val1.u_date,
            u_time: val1.u_time,
            total: total,
            discount: discount,
            net_total: net_total,
          };
          values.push(temp);
        });
        setSearchData(values);
        setSearchTotal(total_all);
        setSearchDiscount(discount_all);
        setSearchNetTotal(net_total_all);
      }
    }
    catch(error){
      
    }
    finally{
      setIsLoading(false);
    }
  }

  async function getSearchDataDeliveries(){
    setIsLoading(true);
    setServerError(false);
    try{
      var error = false;
      var search_data = {};
      search_data["seller_id"] = (session.user.id);
      search_data["from_date"] = searchStartDateView;
      search_data["to_date"] = searchEndDateView;
      if(!error){
        const response = await axios.post("/api/deliveries/summary", {
          search_data: search_data,
        });
        var val = response.data.data.data;
        var index = 1;
        var total_all = 0.0;
        var discount_all = 0.0;
        var net_total_all = 0.0;
        const values = [];
        val.map(val1 => {
          var total = val1.total;
          var discount = val1.discount;
          var net_total = val1.net_total;
          total_all = total_all + total;
          discount_all = discount_all + discount;
          net_total_all = net_total_all + net_total;
          const temp = {
            index: index++,
            id: val1.id,
            u_date: val1.u_date,
            u_time: val1.u_time,
            total: total,
            discount: discount,
            net_total: net_total,
          };
          values.push(temp);
        });
        setSearchDataDeliveries(values);
        setSearchTotalDeliveries(total_all);
        setSearchDiscountDeliveries(discount_all);
        setSearchNetTotalDeliveries(net_total_all);
      }
    }
    catch(error){
      
    }
    finally{
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if(searchTimePeriod==="daily"){
      var categories = [];
      var values = [];
      var values_deliveries = [];
      var res = eachDayOfInterval({start:searchStartDate, end:searchEndDate});
      res.map((val)=>{
        categories.push(format(val, "yyyy-MM-dd"));
        var added = false;
        searchData.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isEqual(val2, val)){
            values.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values.push(0);
        }
        added = false;
        searchDataDeliveries.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isEqual(val2, val)){
            values_deliveries.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values_deliveries.push(0);
        }
      });
      setOptions(categories, values);
      setOptionsDeliveries(categories, values_deliveries);
    }
    else if(searchTimePeriod==="weekly"){
      var categories = [];
      var values = [];
      var values_deliveries = [];
      var res = eachWeekOfInterval({start:searchStartDate, end:searchEndDate}, {weekStartsOn: 1});
      res.map((val)=>{
        categories.push(format(val, "yyyy-MM-dd"));
        var end = endOfWeek(val, { weekStartsOn: 1 });
        var added = false;
        searchData.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values.push(0);
        }
        added = false;
        searchDataDeliveries.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values_deliveries.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values_deliveries.push(0);
        }
      });
      setOptions(categories, values);
      setOptionsDeliveries(categories, values_deliveries);
    }
    else if(searchTimePeriod==="monthly"){
      var categories = [];
      var values = [];
      var values_deliveries = [];
      var res = eachMonthOfInterval({start:searchStartDate, end:searchEndDate});
      res.map((val)=>{
        categories.push(format(val, "yyyy-MM-dd"));
        var end = endOfMonth(val);
        var added = false;
        searchData.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values.push(0);
        }
        added = false;
        searchDataDeliveries.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values_deliveries.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values_deliveries.push(0);
        }
      });
      setOptions(categories, values);
      setOptionsDeliveries(categories, values_deliveries);
    }
    else if(searchTimePeriod==="yearly"){
      var categories = [];
      var values = [];
      var values_deliveries = [];
      var res = eachYearOfInterval({start:searchStartDate, end:searchEndDate});
      res.map((val)=>{
        categories.push(format(val, "yyyy-MM-dd"));
        var end = endOfYear(val);
        var added = false;
        searchData.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values.push(0);
        }
        added = false;
        searchDataDeliveries.map((val1)=>{
          var val2 = parseISO(val1.u_date);
          if(isWithinInterval(val2, {start: val, end})){
            values_deliveries.push(val1.net_total);
            added = true;
          }
        });
        if(!added){
          values_deliveries.push(0);
        }
      });
      setOptions(categories, values);
      setOptionsDeliveries(categories, values_deliveries);
    }
  }, [searchData, searchTimePeriod]);

  const setOptions = (categories, values) => {
    setChartOptions({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: "Amount (Rs.)",
          margin: 20,
        },
      },
      colors: ['#FB8833'],
      series: [
        {
          name: 'Sales',
          data: values
        },
      ],
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false,
      }
    });
  }

  const setOptionsDeliveries = (categories, values) => {
    setChartOptionsDeliveries({
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: "Amount (Rs.)",
          margin: 20,
        },
      },
      colors: ['#dc38d1'],
      series: [
        {
          name: 'Deliveries',
          data: values
        },
      ],
      credits: {
        enabled: false
      },
      accessibility: {
        enabled: false,
      }
    });
  }

  return (
    <div className='form_container mt-10' style={{minHeight: (height-80)}}>
      <div className='form_container_large' style={{minHeight: (height-80)}}>
        <div className='header_container'>
          <div className='header_container_left'>
            <span></span>
            <div className='header_container_left_text'>
              <span className="form_header">Dashboard</span>
              <span className="form_sub_header">Overview of product sales</span>
            </div>
          </div>
          <div className='header_container_right'>
            <div className=''>

            </div>
          </div>
        </div>
        <div className='form_fields_toolbar_container pb-4' style={{borderBottom: '1px solid #e8e8e8'}}>
          <div className='form_fields_toolbar_container_left'>
            <div className='form_text_field_constructed_xtra_small'>
              <span className='form_text_field_constructed_label'>From</span>
              <span className='form_text_field_constructed_text cursor-pointer' onClick={()=>setOpenStartDate(true)}>{searchStartDateView}</span>
              <div className='form_text_field_constructed_actions_1'>
                <CalendarMonth sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenStartDate(true)}/>
              </div>
            </div>
            <div className='form_text_field_constructed_xtra_small'>
              <span className='form_text_field_constructed_label'>To</span>
              <span className='form_text_field_constructed_text cursor-pointer' onClick={()=>setOpenEndDate(true)}>{searchEndDateView}</span>
              <div className='form_text_field_constructed_actions_1'>
                <CalendarMonth sx={{width: 22, height: 22, color: '#6b7280'}} onClick={()=>setOpenEndDate(true)}/>
              </div>
            </div>
            <Button 
              variant='contained' 
              disabled={isLoading} 
              style={{textTransform: 'none'}} 
              startIcon={isLoading?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Search />}
              onClick={()=>{getSearchData(); getSearchDataDeliveries()}}
              size='small'
            >Search</Button>
          </div>
          <div className='form_fields_toolbar_container_right'>
            <TextField className='form_text_field_xtra_small'
              id='time-frame'
              value={searchTimeFrame}
              label="Time Frame"
              onChange={event=>setSearchTimeFrame(event.target.value)} 
              variant={"outlined"}
              select={true}
              disabled={isLoading}
              size='small'
              inputProps={{style: {fontSize: 13}}}
              SelectProps={{style: {fontSize: 13}}}
              InputLabelProps={{style: {fontSize: 15}}}
            >
              <MenuItem value={"this_week"}>This Week</MenuItem>
              <MenuItem value={"this_month"}>This Month</MenuItem>
              <MenuItem value={"this_year"}>This Year</MenuItem>
              <MenuItem value={"last_week"}>Last Week</MenuItem>
              <MenuItem value={"last_month"}>Last Month</MenuItem>
              <MenuItem value={"last_3_months"}>Last 3 Months</MenuItem>
              <MenuItem value={"last_6_months"}>Last 6 Months</MenuItem>
              <MenuItem value={"last_year"}>Last Year</MenuItem>
              <MenuItem value={"last_3_years"}>Last 3 Years</MenuItem>
            </TextField>
            <TextField className='form_text_field_xtra_xtra_small'
              id='time-period'
              value={searchTimePeriod}
              label="Time Period"
              onChange={event=>setSearchTimePeriod(event.target.value)} 
              variant={"outlined"}
              select={true}
              disabled={isLoading}
              size='small'
              inputProps={{style: {fontSize: 13}}}
              SelectProps={{style: {fontSize: 13}}}
              InputLabelProps={{style: {fontSize: 15}}}
            >
              <MenuItem value={"daily"}>Daily</MenuItem>
              <MenuItem value={"weekly"}>Weekly</MenuItem>
              <MenuItem value={"monthly"}>Monthly</MenuItem>
              <MenuItem value={"yearly"}>Yearly</MenuItem>
            </TextField>
          </div>
        </div>
        <div className='w-full px-3 h-[510px]'>
          <div className='form_row_single_left'>
            <span className="form_internal_header">Sales Summary</span>
          </div>
          <div className='form_row_single'>
            <div className='summary_banner'>
              <span className='summary_banner_label'>Total:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment'>{`Rs.`}</span>
                <span className='summary_banner_text'>{parseFloat(searchTotal).toFixed(2)}</span>
              </div>
            </div>
            <div className='summary_banner'>
              <span className='summary_banner_label'>Discount:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment'>{`Rs.`}</span>
                <span className='summary_banner_text'>{parseFloat(searchDiscount).toFixed(2)}</span>
              </div>
            </div>
            <div className='summary_banner'>
              <span className='summary_banner_label'>Net Total:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment'>{`Rs.`}</span>
                <span className='summary_banner_text'>{parseFloat(searchNetTotal).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className='pt-3 w-full h-[350px]'>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
            />
          </div>
        </div>
        <div className='w-full px-3 mt-10 h-[520px]'>
          <div className='form_row_single_left'>
            <span className="form_internal_header">Deliveries</span>
          </div>
          <div className='form_row_single'>
            <div className='summary_banner_1'>
              <span className='summary_banner_label_1'>Total:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment_1'>{`Rs.`}</span>
                <span className='summary_banner_text_1'>{parseFloat(searchTotalDeliveries).toFixed(2)}</span>
              </div>
            </div>
            <div className='summary_banner_1'>
              <span className='summary_banner_label_1'>Discount:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment_1'>{`Rs.`}</span>
                <span className='summary_banner_text_1'>{parseFloat(searchDiscountDeliveries).toFixed(2)}</span>
              </div>
            </div>
            <div className='summary_banner_1'>
              <span className='summary_banner_label_1'>Net Total:</span>
              <div className='summary_banner_text_container'>
                <span className='summary_banner_adornment_1'>{`Rs.`}</span>
                <span className='summary_banner_text_1'>{parseFloat(searchNetTotalDeliveries).toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className='pt-3 w-full h-[350px]'>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptionsDeliveries}
            />
          </div>
        </div>
        <Dialog open={openStartDate} onClose={()=>setOpenStartDate(false)}>
          <DateBrowser {...{setOpen: setOpenStartDate, value: searchStartDate, setValue: setSearchStartDate}}/>
        </Dialog>
        <Dialog open={openEndDate} onClose={()=>setOpenEndDate(false)}>
          <DateBrowser {...{setOpen: setOpenEndDate, value: searchEndDate, setValue: setSearchEndDate}}/>
        </Dialog>
      </div>
    </div>
  )
}

export default Dashboard;