import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchProfile, updateProfile } from "../api/profileApi";

const defaultProfile = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  country: "",
};

function Profile() {
  const [profile, setProfile] = useState(defaultProfile);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loadProfile = async () => {
    setIsLoading(true);
    const response = await fetchProfile();
    if (response?.status === "success") {
      const data = response.profile || {};
      setUserEmail(data.userEmail || "");
      setProfile({
        fullName: data.fullName || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
      });
      setMessage("");
    } else {
      setMessage(response?.message || "Unable to load profile.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    const response = await updateProfile(profile);
    if (response?.status === "success") {
      setMessage("Profile updated.");
    } else {
      setMessage(response?.message || "Unable to update profile.");
    }
    setIsSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  };

  return (
    <Container className="py-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="fw-bold">Profile</h1>
          <p className="text-muted mb-0">
            Keep your contact details up to date.
          </p>
        </Col>
        <Col xs="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      <Row>
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Personal Details</Card.Title>
              {isLoading ? (
                <div className="text-muted">Loading profile...</div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={userEmail} readOnly />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="fullName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      placeholder="Your name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="(+1) 555-555-5555"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Street address"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleChange}
                          placeholder="City"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={profile.country}
                          onChange={handleChange}
                          placeholder="Country"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  {message ? (
                    <div className="mb-3 text-muted">{message}</div>
                  ) : null}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
