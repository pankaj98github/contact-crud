import "./App.css";
import { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  Navbar,
} from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = "http://localhost:3001/users";

const initialState = {
  name: "",
  email: "",
  contact: "",
  address: "",
};

function App() {
  const [state, setState] = useState(initialState);

  const [data, setData] = useState([]);

  const [userId, setUserId] = useState(null);
  const [updateData, setUpdateData] = useState(false);

  const { name, email, contact, address } = state;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await axios.get(api);
    setData(response.data);
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleDelete = async(id) => {
    if(window.confirm("Are you wanted to delete that user"))
    axios.delete(`${api}/${id}`);
    toast.success("Deleted successfully");
    setTimeout(() => loadUsers(), 300);
  };

  const handleUpdate = (id) => {
    const singleUser = data.find((item) => item.id === id);
    setState({...singleUser});
    setUserId(id);
    setUpdateData(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !contact || !address) {
      toast.error("Please fill all input fields!");
    } else {
      if(!updateData){
        axios.post(api, state);
        toast.success("Added successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 300);
      } else {
        axios.put(`${api}/${userId}`, state);
        toast.success("Updated successfully");
        setState({ name: "", email: "", contact: "", address: "" });
        setTimeout(() => loadUsers(), 300);
        setUserId(null);
        setUpdateData(false);
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Navbar bg="primary" variant="dark" className="justify-content-center">
        <Navbar.Brand><h2>Contacts CRUD</h2></Navbar.Brand>
      </Navbar>

      <Container style={{ marginTop: "70px" }}>
        <Row>
          <Col md={4}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label style={{ textAlign: "left" }}>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "1rem" }}>
                <Form.Label style={{ textAlign: "left" }}>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "1rem" }}>
                <Form.Label style={{ textAlign: "left" }}>Contact</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your contact"
                  name="contact"
                  value={contact}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group style={{ marginTop: "1rem" }}>
                <Form.Label style={{ textAlign: "left" }}>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your address"
                  name="address"
                  value={address}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="primary" size="lg">
                  {updateData ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>

          <Col md={8}>
            <Table bordered hover style={{ marginLeft: "1rem" }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th>Address</th>
                  <th>Action</th>
                </tr>
              </thead>

              {data &&
                data.map((item, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.contact}</td>
                      <td>{item.address}</td>
                      <td>
                        <ButtonGroup>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="primary"
                            onClick={() => handleUpdate(item.id)}
                          >
                            Update
                          </Button>
                          <Button
                            style={{ marginRight: "5px" }}
                            variant="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
