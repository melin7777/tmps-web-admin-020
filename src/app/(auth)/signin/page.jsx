'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { InputAdornment, CircularProgress, Button, TextField } from '@mui/material';
import { signIn, useSession } from 'next-auth/react';
import { Google, KeyOutlined, Login, MailOutline, PersonAdd } from '@mui/icons-material';
import { emailReg } from '@/utils/Validate';
import useWindowDimensions from '@/hooks/useWindowDimension';

const Signin = () => {
  const router = useRouter();
  const {data: session, status} = useSession();
  const [serverError, setServerError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { width, height=500 } = useWindowDimensions();

  const [editEmail, setEditEmail] = useState("");
  const [editEmailError, setEditEmailError] = useState(false);
  const [editPassword, setEditPassword] = useState("");
  const [editPasswordError, setEditPasswordError] = useState(false);
  const [editLoginError, setEditLoginError] = useState(false);

  useEffect(() => {
    setIsSaving(false);
  }, []);

  useEffect(() => {
    if(status==='authenticated'){
      router.push("/");
    }
  }, [status]);

  const clearFields = () => {
    setEditEmail("");
    setEditPassword("");
  }

  const onSubmit = async (provider) => {
    setIsSaving(true);
    setEditLoginError(false);
    setServerError(false);
    setEditEmailError(false);
    setEditPasswordError(false);
    if(provider==="credentials"){
      var error = false;
      if(editEmail.length>128 || !emailReg.test(editEmail)) {
        error = true;
        setEditEmailError(true);
      }
      if(editPassword.length===0 || editPassword.length>12) {
        error = true;
        setEditPasswordError(true);
      }
      if(error){
        setIsSaving(false);
      }
      else{
        try{
          const result = await signIn("credentials", {
            email: editEmail,
            password: editPassword,
            redirect: false,
          });
          setIsSaving(false);
          if(result.ok){
            if(result.error==="CredentialsSignin"){
              setIsSaving(false);
              clearFields();
              setEditLoginError(true);
            }
            else{
              clearFields();
              router.push("/");
            }
          }
          else{
            clearFields();
            setIsSaving(false);
            setEditLoginError(true);
          }
        }
        catch(error){
          setIsSaving(false);
        }
      }
    }
  }

  return (
    <div className='form_container' style={{minHeight: (height)}}>
      <div className='form_container_small'>
        <div className='w-[70px] h-[50px] relative'><Image src='/logo-small.png' alt='logo'  fill sizes='70px' priority={true} style={{objectFit: 'cover'}}/></div>
        <span className="form_header my-3">Admin Sign In</span>
        <div className='form_fields_container'>
          <div className='form_row_single'>
            <div className='form_field_container'>
              <TextField 
                id='email'
                label="Email" 
                variant="outlined" 
                className='form_text_field' 
                value={editEmail} 
                error={editEmailError}
                onChange={event=>setEditEmail(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MailOutline sx={{width: 26, height: 26, color: editEmailError?'crimson':'#94a3b8'}}/></InputAdornment>,
                }}
                disabled={isSaving}
                onFocus={()=>setEditEmailError(false)}
              />
              {editEmailError && <span className='form_error_floating'>*Invalid Email</span>}
            </div>
          </div>
          <div className='form_row_single'>
            <div className='form_field_container'>
              <TextField 
                id='password'
                type={"password"} 
                label="Password" 
                variant="outlined" 
                className='form_text_field' 
                value={editPassword}
                error={editPasswordError}
                onChange={event=>setEditPassword(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><KeyOutlined sx={{width: 26, height: 26, color: editPasswordError?'crimson':'#94a3b8'}}/></InputAdornment>
                }}
                disabled={isSaving}
                onFocus={()=>setEditPasswordError(false)}
              />
              {editPasswordError && <span className='form_error_floating'>*Invalid Password</span>}
            </div>
          </div>
          <div className='form_row_single'>
            {editLoginError && <span className='form_error_fixed'>*Invalid Loogin Details</span>}
          </div>
          <div className='form_row_double_fixed'>
            <Button variant="text" style={{textTransform: 'none'}} onClick={()=>router.push("/reset")}>Forgot Password?</Button>
            <Button 
              variant='contained' 
              disabled={isSaving} 
              style={{textTransform: 'none'}} 
              endIcon={isSaving?<CircularProgress size={18} style={{'color': '#9ca3af'}}/>:<Login />}
              onClick={()=>onSubmit("credentials")}
            >Sign In</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signin;