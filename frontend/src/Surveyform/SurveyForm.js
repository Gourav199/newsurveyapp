import React, { useState, useRef, useEffect } from 'react';
import Header from '../Layout/Header';
import { useNavigate } from "react-router-dom"; 
import surveyService from '../Service/SurveyFormService';
import { trackPromise } from "react-promise-tracker";

export default function SurveyForm() {
    const navigate = useNavigate(); // Initialize useNavigate
    useEffect(() => {
        const userSession = sessionStorage.getItem("user");
        if (!userSession) {
            navigate("/"); // Redirect to login if session data is missing
        }
    }, [navigate]); 

    const [formData, setFormData] = useState({
        ownerName: "",
        fatherHusbandName: "",
        buildingAddress: "",
        residenceAddress: "",
        coveredArea: "",
        openLandArea: "",
        roomDimensions: "",
        balconyCorridorDimensions: "",
        garageDimensions: "",
        carpetArea1: "",
        carpetArea2: "",


        fullName: "",
        address: "",
        pinCode: "",
        mobileNo: "",
        email: "",
        aadharCard: "",
        latitude: "",
        longitude: "",
        capturedImages: [],
        propertyType: "" 
    });

    const [selectedOptions, setSelectedOptions] = useState({
        locationBuildingLand: "",
        buildingConstructionType: "",
        landLocation: ""
    });

    const handleRadioChange = (e) => {
        const { name, value } = e.target;
        setSelectedOptions((prev) => ({ ...prev, [name]: value }));
    };

    const fieldLabels = {
        ownerName: "Owner's Name",
        fatherHusbandName: "Father/Husband's Name",
        buildingAddress: "Building/House/Plot No and Locational address",
        residenceAddress: "Address of the residence of owner/ occupier-",
        coveredArea: "Covered area of building (sq ft)",
        openLandArea: "Area of open Land or plot (sq ft)",
        roomDimensions: "Internal dimensions of all rooms and all covered verandah",
        balconyCorridorDimensions: "Internal dimensions of all balcony corridor kitchen and store   ",
        garageDimensions: "Internal dimensions of all garages",
        carpetArea1: "Carpet Area 1",
        carpetArea2: "Carpet Area 2",

        fullName: "Full Name",
        address: "Address",
        pinCode: "Pin Code",
        mobileNo: "Mobile Number",
        email: "Email",
        aadharCard: "Aadhar Card",
        latitude: "Latitude",
        longitude: "Longitude",


    };

    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const calculateCarpetAreas = (data) => {
        const room = parseFloat(data.roomDimensions) || 0;
        const balcony = parseFloat(data.balconyCorridorDimensions) || 0;
        const garage = parseFloat(data.garageDimensions) || 0;
        const coveredArea = parseFloat(data.coveredArea) || 0;

        const carpetArea1 = room + balcony * 0.5 + garage * 0.25;
        const carpetArea2 = coveredArea * 0.8;

        return { carpetArea1: carpetArea1.toFixed(2), carpetArea2: carpetArea2.toFixed(2) };
    };


    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            setError("Unable to access the camera");
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext("2d");
            context.drawImage(videoRef.current, 0, 0, 300, 200);
            const imageData = canvasRef.current.toDataURL("image/png");

            setFormData((prevData) => {
                if (prevData.capturedImages.length < 4) {
                    return { ...prevData, capturedImages: [...prevData.capturedImages, imageData] };
                } else {
                    alert("You can only capture up to 4 images.");
                    return prevData;
                }
            });
        }
    };


    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prevData) => ({
                        ...prevData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                () => setError("Unable to retrieve location")
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };

        if (["roomDimensions", "balconyCorridorDimensions", "garageDimensions", "coveredArea"].includes(name)) {
            const carpetAreas = calculateCarpetAreas(updatedData);
            updatedData.carpetArea1 = carpetAreas.carpetArea1;
            updatedData.carpetArea2 = carpetAreas.carpetArea2;
        }

        setFormData(updatedData);
    };

    const handleSubmit = () => {
        // localStorage.setItem("userDetails", JSON.stringify(formData));
        
        const mergedData = { ...formData, ...selectedOptions };
        console.log(mergedData);
        trackPromise(
            surveyService.saveUserDetails(mergedData)
                .then((res) => {
                  console.log("Response from API:", res);
        
                  if (res.status === 200) {
                    // ✅ Store user data (optional)
                    // sessionStorage.setItem("user", JSON.stringify(res.data.user));
                    alert("User details saved successfully!");
        
                    // ✅ Navigate to SurveyForm.js after successful login
                    navigate("/survey-form");
                  } else {
                    throw new Error(res.data.message || "Login failed");
                  }
                })
                .catch((err) => {
                  console.error("Login error:", err);
                //   setError("Invalid username or password"); // Show error message
                })
            );
        // setFormData({
        //     ownerName: "",
        //     fatherHusbandName: "",
        //     buildingAddress: "",
        //     residenceAddress: "",
        //     coveredArea: "",
        //     openLandArea: "",
        //     roomDimensions: "",
        //     balconyCorridorDimensions: "",
        //     garageDimensions: "",
        //     fullName: "",
        //     address: "",
        //     pinCode: "",
        //     mobileNo: "",
        //     email: "",
        //     latitude: "",
        //     longitude: "",
        //     capturedImages: [],
        //     propertyType: "" 
        // });
        // setSelectedOptions({
        //     locationBuildingLand: "",
        //     buildingConstructionType: "",
        //     landLocation: ""
        // });


    };

    return (
        <>
        <Header />
        <div className="container mt-4">
            <h2 className="text-center mb-4">Survey Details Form</h2>
            <div className="card p-4">
                <div className="mb-3">
                    <label className="form-label">Property Type:</label>
                    <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="">Select Property Type</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Non-Commercial">Non-Commercial</option>
                        <option value="Mixed">Mixed</option>
                    </select>
                </div>

                <form className="mb-4">
                    {Object.keys(formData).map((key) => (
                        key !== "capturedImages" && (
                            <div key={key} className="mb-3">
                                <label className="form-label">{fieldLabels[key] || key}:</label>

                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="form-control"
                                    readOnly={key === "carpetArea1" || key === "carpetArea2" || key === "capturedImages"}

                                />
                            </div>
                        )
                    ))}
                </form>
                <div className="">
                    <button className="btn btn-success" onClick={getLocation}>Get Location</button>
                    {formData.latitude && formData.longitude && (
                        // <p className="mt-2">Latitude: {formData.latitude}, Longitude: {formData.longitude}</p>
                        <p></p>
                    )}
                </div>

                <div className="mb-4">
                    <h4>3 – Details of Location</h4>

                    {/* Section A – Building or Land Location */}
                    <div className="mb-3">
                        <h5>A – Building or Land is located</h5>
                        {[
                            "On road having a width of more than 24 metres",
                            "On road a width of more than 12 metres and upto 24 metres",
                            "On road having a width of more than 9 metres upto 12 metres",
                            "On road having width upto 9 metres"
                        ].map((option, index) => (
                            <div key={index} className="form-check">
                                <input
                                    type="radio"
                                    name="locationBuildingLand"
                                    value={option}
                                    checked={selectedOptions.locationBuildingLand === option}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">{option}</label>
                            </div>
                        ))}
                    </div>

                    {/* Section B – Nature of Construction */}
                    <div className="mb-3">
                        <h5>B – Nature of Construction of Building</h5>
                        {[
                            "Pakka building with R.C.C roof or R.B roof",
                            "Other Pakka building",
                            "Kachcha building i.e all other buildings not covered"
                        ].map((option, index) => (
                            <div key={index} className="form-check">
                                <input
                                    type="radio"
                                    name="buildingConstructionType"
                                    value={option}
                                    checked={selectedOptions.buildingConstructionType === option}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">{option}</label>
                            </div>
                        ))}
                    </div>

                    {/* Section C – Land Location (if no building is constructed) */}
                    <div className="mb-3">
                        <h5>C – Land (if no building is constructed over it) is located</h5>
                        {[
                            "On road having a width of more than 24 metres",
                            "On road a width of more than 12 metres and upto 24 metres",
                            "On road having a width of more than 9 metres upto 12 metres",
                            "On road having width upto 9 metres"
                        ].map((option, index) => (
                            <div key={index} className="form-check">
                                <input
                                    type="radio"
                                    name="landLocation"
                                    value={option}
                                    checked={selectedOptions.landLocation === option}
                                    onChange={handleRadioChange}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">{option}</label>
                            </div>
                        ))}
                    </div>
                </div>;

                <div className="">
                    <button className="btn btn-primary me-2" onClick={openCamera}>Open Camera</button>
                    <button className="btn btn-danger" onClick={capturePhoto}>Capture Photo</button>
                </div>
                <div className="mt-3">
                    <video ref={videoRef} autoPlay className="border" width="300" height="200" />
                    <canvas ref={canvasRef} width="300" height="200" style={{ display: "none" }} />
                </div>
                {formData.capturedImages.length > 0 && (
                    <div className="mt-4">
                        <h4>Captured Images:</h4>
                        <div className="d-flex flex-wrap">
                            {formData.capturedImages.map((img, index) => (
                                <img key={index} src={img} alt={`Captured ${index + 1}`} className="border mt-2 img-fluid mx-2" width="150" height="100" />
                            ))}
                        </div>
                    </div>
                )}


                <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                </div>
                {error && <p className="text-danger text-center mt-2">{error}</p>}
            </div>
        </div>
        </>
    )
}
