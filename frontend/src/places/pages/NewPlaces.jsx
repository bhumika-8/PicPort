import React ,{useCallback,useReducer,useContext} from "react";
import Input from "../../shared/components/FormElements/Input";
import "./NewPlaces.css";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/utils/validators";
import Button from "../../shared/components/UIelements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
const NewPlaces = props =>{
    const auth=useContext(AuthContext);
    const navigate = useNavigate();
    const{isLoading,error,sendRequest,clearError}=useHttpClient();
const[formState,inputHandler]=useForm({
     title:{
            value:'',
            isValid:false
        },
        description:{
            value:'',
            isValid:false
        },
          address:{
            value:'',
            isValid:false
        },
        image:{
            value:null,
            isValid:false
        }
},false

);


// const descriptionInputHandler = useCallback((id,value,isValid)=>{

// },[]);
const placeSubmitHandler = async event =>{
    
    event.preventDefault();
    try{
        const formData=new FormData();
        formData.append('title',formState.inputs.title.value);
        formData.append('description',formState.inputs.description.value);

        formData.append('address',formState.inputs.address.value);
        formData.append('creator',auth.userId);

        formData.append('image',formState.inputs.image.value);

    const responseData =await sendRequest('http://localhost:5000/api/places','POST',formData)
    navigate(`/${auth.userId}/places`);

}catch(err){

}
};
    return (

    <React.Fragment>
        <ErrorModal error={error} onClear={clearError} />
<form className="place-form" onSubmit={placeSubmitHandler}>
{isLoading && <LoadingSpinner asOverlay />}
<Input
id="title" 
element="input" 
type="text" 
label="Title" 
placeholder="Enter Title"
validators={[VALIDATOR_REQUIRE()]}
errorText="Please Enter a valid text."
onInput={inputHandler}
 />

 <Input
id="description" 
element="textarea" 
label="Description" 
placeholder="Enter Description"
validators={[VALIDATOR_MINLENGTH(5)]}
errorText="Please Enter a valid description (atleast 5 chars)"
onInput={inputHandler}
 />
  <Input
id="address" 
element="input" 
label="Address" 
placeholder="Enter Address of the location"
validators={[VALIDATOR_REQUIRE()]}
errorText="Please Enter the address of the location"
onInput={inputHandler}
 />
 <ImageUpload id="image" onInput={inputHandler} errorText="please provide an image"/>
 <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
    </React.Fragment>
    );
}

export default NewPlaces;