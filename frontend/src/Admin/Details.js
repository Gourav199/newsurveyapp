import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';
import "./Details.css"
export default function Details() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user;

    if (!user) {
        return <h2>No User Data Found</h2>;
    }

    // Ensure capturedImages is always an array
    const capturedImages = Array.isArray(user.capturedImages)
    ? user.capturedImages
    : typeof user.capturedImages === "string"
    ? JSON.parse(user.capturedImages) // Convert stringified array to real array
    : [];

console.log("Captured Images:", capturedImages); // Debugging


    return (
        <>
        <Header />
        <div className="container mt-4">
            <button className="btn btn-secondary mb-3 back-button" onClick={() => navigate(-1)}>Back</button>
            <h2>User Details</h2>
            <table className="table table-bordered">
                <tbody>
                    {Object.entries(user).map(([key, value]) => (
                        key !== 'capturedImages' && (
                            <tr key={key}>
                                <th>{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</th>
                                <td>{value || 'N/A'}</td>
                            </tr>
                        )
                    ))}
                    {/* Image Section */}
                    {capturedImages.length > 0 && (
                        <tr>
                            <th>Captured Images</th>
                            <td>
                            <div className="d-flex flex-wrap">
    {capturedImages.length > 0 ? (
        capturedImages.map((image, index) => {
            // Remove any unwanted prefix if present
            const base64Image = image.startsWith("data:image")
                ? image // If already in correct format, use as is
                : `data:image/png;base64,${image.replace(/[\[\]"]/g, '')}`; // Otherwise, prepend the required format

            return (
                <img
                    key={index}
                    src={base64Image}
                    alt={`Captured ${index + 1}`}
                    className="img-thumbnail m-2"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
            );
        })
    ) : (
        <p>No images available</p>
    )}
</div>

                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        </>
    );
}
