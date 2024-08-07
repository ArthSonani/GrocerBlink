import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { userSigninStart, userSigninSuccess, userSigninFailure } from '../redux/user/userSlice'

export default function Signup() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [ formData, setFormData ] = React.useState(
        { firstname: '', lastname: '', email: '', zipcode: '', password: '', c_password: '', area: '' }
    )
    
    const { loading, error } = useSelector(state =>state.user)
    const [ formError, setFormError ] = React.useState(null)

    function updateData(event){
        const { name, value } = event.target;

        setFormData((preData)=>{
            return{
                ...preData,
                [name] : value
            }
        })
    }

    async function submitData(event){
        event.preventDefault()

        const validateFormData = () => {
            if (!formData.firstname) return 'Must provide your first name!';
            else if (!formData.lastname) return 'Must provide your last name!';
            else if (!formData.email) return 'Must provide your email!';
            else if (!formData.zipcode) return 'Must provide your area zipcode!';
            else if (!formData.password) return 'Must provide strong password!';
            else if (!formData.c_password) return 'Must provide confirm password!';
            else if (!formData.area) return 'Must provide your area name!';
            else if(formData.password !== formData.c_password) return "Password doesn't match!"
            return null;
        };
    
        const formError = validateFormData();
        if (formError) {
            setFormError(formError);
            return;
        }

        try{
            dispatch(userSigninStart())
            const res = await fetch('/api/user/auth/signup', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            // console.log(data)

            if(data.success === false){
                dispatch(userSigninFailure(data.message))
                return
            }
            dispatch(userSigninSuccess(data))
            navigate('/shop/all-stores')
        }
        catch(err){
            dispatch(userSigninFailure(err))
        }
    }
    

      
  return (
    <main className='signup-main'>
        <div className='signup-page'>
            <div className='signup-head'>
                <h1>Create an account</h1>
                <h5>Already have an account? <Link className='signin-link' to='/user/signin'>Signin</Link></h5>
                <div className='signup-option'>
                    <div style={{width: '20%'}} className='signup-option-div'><img src="/facebook.png" alt="Facebook" width="25" /></div>
                    <div style={{width: '80%'}} className='signup-option-div'>Continue with Facebook</div>
                </div>
                <div className='signup-option'>
                    <div style={{width: '20%'}} className='signup-option-div'><img src="https://dye1fo42o13sl.cloudfront.net/social-icons/google-logo-icon.png" alt="Google" width="25" /></div>
                    <div style={{width: '80%'}} className='signup-option-div'>Continue with Google</div>
                </div>
            </div>

            <hr className='signup-line'/>

            <div className='signup-form-container'>
                <form className='signup-form'>

                    <input type='text' className='signup-input' placeholder='First Name' onChange={updateData} name='firstname' value={formData.firstname} />
                    <input type='text' className='signup-input' placeholder='Last Name' onChange={updateData} name='lastname' value={formData.lastname} />
                    <input type='number' className='signup-input number-input' placeholder='Zip Code' pattern="[0-9]{6}" onChange={updateData} name='zipcode' value={formData.zipcode} />
                    <input type='text' className='signup-input' placeholder='Area Name' onChange={updateData} name='area' value={formData.area} />
                    <br />
                    <input type='email' className='signup-input' placeholder='Email' onChange={updateData} name='email' value={formData.email} />
                    <input type='password' className='signup-input' placeholder='Password' onChange={updateData} name='password' value={formData.password} />
                    <input type='password' className='signup-input' placeholder='Confirm Password' onChange={updateData} name='c_password' value={formData.c_password} />

                    {formError && <p style={{color: 'red', marginTop: '20px', textAlign: 'center'}}>{formError}</p>}

                    <div className='button-container'>
                        {error && <p style={{color: 'red', marginTop: '20px'}}>{JSON.stringify(error)}</p>}
                        <div disable={loading? 'true' : 'undefined'} onClick={submitData} className='signup-button'>{loading? "Loading..." : "Create account" }</div>
                    </div>
                    <p className='signup-p'>By signing up, or continuing with Facebook or Google,<br />
                    you agree to the GrocerBlink <Link to='/'><span style={{textDecoration: 'underline'}}>Terms of Service</span></Link></p>
                </form>
            </div>
        </div>
    </main>
  )
}
