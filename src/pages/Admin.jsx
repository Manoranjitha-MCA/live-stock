// AdminPage.js
import { Layout, Menu, Form, Input, Button, Table, Popconfirm } from "antd";
import { AppstoreOutlined, PhoneOutlined, PictureOutlined, UserOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue, remove, update } from "firebase/database";

const { Header, Content, Sider } = Layout;

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [editForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [galleryForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    const galleryRef = ref(db, "gallery");
    onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      setGallery(data ? Object.keys(data).map((key) => ({ id: key, url: data[key] })) : []);
    });

    const enquiriesRef = ref(db, "enquiries");
    onValue(enquiriesRef, (snapshot) => {
      const data = snapshot.val();
      setEnquiries(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });
  }, []);

  const addProduct = (values) => {
    push(ref(db, "products"), values);
    productForm.resetFields();
  };
  const deleteEnquiry = (id) => remove(ref(db, `enquiries/${id}`));
  const deleteProduct = (id) => remove(ref(db, `products/${id}`));
  const deleteUser = (id) => remove(ref(db, `users/${id}`));
  const deleteGalleryImage = (id) => remove(ref(db, `gallery/${id}`));

  const addGalleryImage = (values) => {
    push(ref(db, "gallery"), values.url);
    galleryForm.resetFields();
  };

  const editProduct = (record) => {
    editForm.setFieldsValue(record); // Pre-fill form with row data
    setEditingKey(record.id);
  };
  
  const saveProduct = async (id) => {
    try {
      const values = await editForm.validateFields(); // Validate fields before saving
      await update(ref(db, `products/${id}`), values); // Update Firestore
      setEditingKey(null); // Exit edit mode
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };
  const enquiryColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { 
      title: "Mobile", 
      dataIndex: "mobile", 
      key: "mobile",
      render: (mobile) => (
        <Button type="link" icon={<PhoneOutlined />} onClick={() => window.open(`tel:${mobile}`)}>
          {mobile}
        </Button>
      ),
    },
    { title: "Message", dataIndex: "message", key: "message" },
  ];
  

  const productColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="name" rules={[{ required: true, message: "Enter name" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: "Breed",
      dataIndex: "breed",
      key: "breed",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="breed" rules={[{ required: true, message: "Enter breed" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.breed
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="amount" rules={[{ required: true, message: "Enter amount" }]}>
            <Input type="number" />
          </Form.Item>
        ) : (
          record.amount
        ),
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="imageUrl" rules={[{ required: true, message: "Enter image URL" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.imageUrl
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {editingKey === record.id ? (
            <Button onClick={() => saveProduct(record.id)} type="link">Save</Button>
          ) : (
            <Button onClick={() => editProduct(record)} type="link">Edit</Button>
          )}
          <Popconfirm title="Are you sure?" onConfirm={() => deleteProduct(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  
  

  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm title="Are you sure?" onConfirm={() => deleteUser(record.id)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} onClick={(e) => setSelectedMenu(e.key)}>
          <Menu.Item key="1" icon={<AppstoreOutlined />}>Add Products</Menu.Item>
          <Menu.Item key="2" icon={<PictureOutlined />}>Add Gallery</Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>Manage Users</Menu.Item>
          <Menu.Item key="4" icon={<PhoneOutlined />}>Enquiries</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          {selectedMenu === "1" && (
            <>
              <h2>Manage Products</h2>
              <Form form={productForm} onFinish={addProduct} layout="inline">
                <Form.Item name="name" rules={[{ required: true, message: "Enter name" }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item name="breed" rules={[{ required: true, message: "Enter breed" }]}>
                  <Input placeholder="Breed" />
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true, message: "Enter amount" }]}>
                  <Input placeholder="Amount" type="number" />
                </Form.Item>
                <Form.Item name="imageUrl" rules={[{ required: true, message: "Enter image URL" }]}>
                  <Input placeholder="Image URL" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Add Product</Button>
                </Form.Item>
              </Form>
              <Form form={editForm} component={false}>
                    <Table dataSource={products} columns={productColumns} rowKey="id" />
                </Form>
            </>
          )}
          {selectedMenu === "2" && (
            <>
              <h2>Manage Gallery</h2>
              <Form form={galleryForm} onFinish={addGalleryImage} layout="inline">
                <Form.Item name="url" rules={[{ required: true, message: "Enter Image URL" }]}>
                  <Input placeholder="Image URL" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Add Image</Button>
                </Form.Item>
              </Form>
              <Table dataSource={gallery} columns={[ { title: "Image URL", dataIndex: "url", key: "url" }, { title: "Actions", key: "actions", render: (_, record) => ( <Popconfirm title="Are you sure?" onConfirm={() => deleteGalleryImage(record.id)}> <Button type="link" danger>Delete</Button> </Popconfirm> ) } ]} rowKey="id" />
            </>
          )}
          {selectedMenu === "3" && (
            <>
              <h2>Manage Users</h2>
              <Table dataSource={users} columns={userColumns} rowKey="id" />
            </>
          )}
          {selectedMenu === "4" && (
            <>
              <h2>Enquiries</h2>
              <Table dataSource={enquiries} columns={enquiryColumns} rowKey="id" />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminPage;
