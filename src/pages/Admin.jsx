import { Layout, Menu, Form, Input, Button, Table, Popconfirm, InputNumber, Select, Modal, Tabs, Tag, Image, Badge, message, Card, Typography, Divider, Row, Col, Timeline, Avatar } from "antd";
import { 
  AppstoreOutlined, 
  LoginOutlined, 
  PhoneOutlined, 
  PictureOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue, remove, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/lib/input/TextArea";

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [galleryForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [replyForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [enquiries, setEnquiries] = useState([]);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [currentEnquiryId, setCurrentEnquiryId] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

    // Fetch orders
    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      setOrders(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
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

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsVisible(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      // Update in orders collection
      await update(ref(db, `orders/${orderId}`), { status });
      
      // Update in user's orders
      const order = orders.find(o => o.orderId === orderId);
      if (order && order.userId) {
        await update(ref(db, `users/${order.userId}/orders/${orderId}`), { status });
      }
      
      // Close modal if open
      setOrderDetailsVisible(false);
      message.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Failed to update order status");
    }
  };

  // Open chat modal for enquiry
  const openChatModal = (enquiryId) => {
    setCurrentEnquiryId(enquiryId);
    setChatModalVisible(true);
    replyForm.resetFields();
  };

  // Send reply to enquiry
  const sendReply = async (values) => {
    try {
      const enquiry = enquiries.find(e => e.id === currentEnquiryId);
      if (!enquiry) return;

      // Create a new message object
      const newMessage = {
        text: values.reply,
        timestamp: new Date().toISOString(),
        sender: 'admin',
        senderName: 'Admin'
      };

      // Initialize messages array if it doesn't exist
      const messages = enquiry.messages || [];
      messages.push(newMessage);

      // Update enquiry with new message and status
      await update(ref(db, `enquiries/${currentEnquiryId}`), {
        messages: messages,
        status: 'replied',
        lastReplyDate: new Date().toISOString(),
        lastReplySender: 'admin'
      });

      replyForm.resetFields();
      message.success("Reply sent successfully");
    } catch (error) {
      console.error("Error sending reply:", error);
      message.error("Failed to send reply");
    }
  };

  // Open user edit modal
  const openUserModal = (user) => {
    setCurrentUser(user);
    userForm.setFieldsValue({
      name: user.name,
      phone: user.phone,
      address: user.address || ''
    });
    setUserModalVisible(true);
  };

  // Update user information
  const updateUser = async (values) => {
    try {
      if (!currentUser) return;

      // Update user information
      await update(ref(db, `users/${currentUser.id}`), values);
      
      setUserModalVisible(false);
      message.success("User information updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user information");
    }
  };

  // Get status tag color
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'orange',
      verified: 'green',
      cancelled: 'red',
    };
    return statusColors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined />;
      case 'verified':
        return <CheckCircleOutlined />;
      case 'cancelled':
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  // Get enquiry status
  const getEnquiryStatus = (enquiry) => {
    if (!enquiry.messages || enquiry.messages.length === 0) {
      return 'new';
    }
    
    return enquiry.lastReplySender === 'admin' ? 'replied' : 'new-reply';
  };

  const enquiryColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Button type="link" icon={<PhoneOutlined />} onClick={() => window.open(`tel:${phone}`)}>
          {phone}
        </Button>
      ),
    },
    { title: "Looking For", dataIndex: "lookingFor", key: "lookingFor" },
    { 
      title: "Last Activity", 
      key: "lastActivity",
      render: (_, record) => {
        if (!record.messages || record.messages.length === 0) {
          return <span>{new Date(record.date).toLocaleDateString()}</span>;
        }
        
        const lastMessage = record.messages[record.messages.length - 1];
        return (
          <span>
            {new Date(lastMessage.timestamp).toLocaleDateString()} by {lastMessage.senderName}
          </span>
        );
      },
      sorter: (a, b) => {
        const aDate = a.lastReplyDate || a.date;
        const bDate = b.lastReplyDate || b.date;
        return new Date(bDate) - new Date(aDate);
      }
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status = getEnquiryStatus(record);
        let color, text;
        
        switch(status) {
          case 'new':
            color = 'orange';
            text = 'New';
            break;
          case 'replied':
            color = 'green';
            text = 'Replied';
            break;
          case 'new-reply':
            color = 'blue';
            text = 'New Reply';
            break;
          default:
            color = 'default';
            text = 'Unknown';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Replied', value: 'replied' },
        { text: 'New Reply', value: 'new-reply' },
      ],
      onFilter: (value, record) => getEnquiryStatus(record) === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            icon={<MessageOutlined />} 
            onClick={() => openChatModal(record.id)}
          >
            Chat
          </Button>
          <Popconfirm title="Delete this enquiry?" onConfirm={() => deleteEnquiry(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    }
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
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="stock" rules={[{ required: true, message: "Enter no. of stock" }]}>
            <InputNumber/>
          </Form.Item>
        ) : (
          record.stock
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
  
  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span>{text.substring(6, 14)}...</span>,
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Verified', value: 'verified' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => viewOrderDetails(record)}>
            View Details
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="link" 
              onClick={() => updateOrderStatus(record.orderId, 'verified')}
            >
              Verify
            </Button>
          )}
          {record.status === 'pending' && (
            <Popconfirm 
              title="Cancel this order?" 
              onConfirm={() => updateOrderStatus(record.orderId, 'cancelled')}
            >
              <Button type="link" danger>Cancel</Button>
            </Popconfirm>
          )}
        </div>
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
          <Menu.Item key="4" icon={<PhoneOutlined />}>
            Enquiries
            <Badge 
              count={enquiries.filter(e => !e.messages || e.lastReplySender !== 'admin').length} 
              offset={[10, 0]}
              style={{ backgroundColor: '#1890ff' }}
            />
          </Menu.Item>
          <Menu.Item key="5" icon={<ShoppingOutlined />}>
            Orders
            <Badge 
              count={orders.filter(o => o.status === 'pending').length} 
              offset={[10, 0]}
              style={{ backgroundColor: '#f5222d' }}
            />
          </Menu.Item>
          <Menu.Item key="logout" icon={<LoginOutlined />} onClick={()=> {navigate("/")}}>
            Logout
          </Menu.Item>
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
                <Form.Item name="stock" rules={[{ required: true, message: "Enter no. stock" }]}>
                  <InputNumber placeholder="no. of stock" />
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true, message: "Enter amount" }]}>
                  <InputNumber placeholder="Amount" />
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
              <Title level={2}>Manage Users</Title>
              <Divider />
              <Row gutter={[16, 16]}>
                {users.map(user => (
                  <Col xs={24} sm={12} md={8} lg={6} key={user.id}>
                    <Card 
                      hoverable
                      actions={[
                        <EditOutlined key="edit" onClick={() => openUserModal(user)} />,
                        <Popconfirm 
                          title="Are you sure you want to delete this user?" 
                          onConfirm={() => deleteUser(user.id)}
                        >
                          <DeleteOutlined key="delete" />
                        </Popconfirm>
                      ]}
                    >
                      <Card.Meta
                        title={user.name}
                        description={
                          <div>
                            <p><PhoneOutlined /> {user.phone}</p>
                            {user.address && <p>{user.address}</p>}
                            {user.orders && (
                              <p>Orders: {Object.keys(user.orders).length}</p>
                            )}
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
          {selectedMenu === "4" && (
            <>
              <h2>Enquiries</h2>
              <Tabs defaultActiveKey="all">
                <TabPane tab="All Enquiries" key="all">
                  <Table 
                    dataSource={enquiries} 
                    columns={enquiryColumns} 
                    rowKey="id"
                    rowClassName={(record) => {
                      const status = getEnquiryStatus(record);
                      if (status === 'new-reply') return 'new-reply-row';
                      if (status === 'replied') return 'replied-row';
                      return '';
                    }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={enquiries.filter(e => !e.messages || e.messages.length === 0).length} 
                      style={{ backgroundColor: '#faad14' }}
                    >
                      <span>New</span>
                    </Badge>
                  } 
                  key="new"
                >
                  <Table 
                    dataSource={enquiries.filter(e => !e.messages || e.messages.length === 0)} 
                    columns={enquiryColumns} 
                    rowKey="id"
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={enquiries.filter(e => e.messages && e.messages.length > 0 && e.lastReplySender !== 'admin').length} 
                      style={{ backgroundColor: '#1890ff' }}
                    >
                      <span>New Replies</span>
                    </Badge>
                  } 
                  key="new-replies"
                >
                  <Table 
                    dataSource={enquiries.filter(e => e.messages && e.messages.length > 0 && e.lastReplySender !== 'admin')} 
                    columns={enquiryColumns} 
                    rowKey="id"
                    rowClassName="new-reply-row"
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={enquiries.filter(e => e.messages && e.messages.length > 0 && e.lastReplySender === 'admin').length} 
                      style={{ backgroundColor: '#52c41a' }}
                    >
                      <span>Replied</span>
                    </Badge>
                  } 
                  key="replied"
                >
                  <Table 
                    dataSource={enquiries.filter(e => e.messages && e.messages.length > 0 && e.lastReplySender === 'admin')} 
                    columns={enquiryColumns} 
                    rowKey="id"
                    rowClassName="replied-row"
                  />
                </TabPane>
              </Tabs>
            </>
          )}
          {selectedMenu === "5" && (
            <>
              <h2>Manage Orders</h2>
              <Tabs defaultActiveKey="all">
                <TabPane tab={`All Orders (${orders.length})`} key="all">
                  <Table 
                    dataSource={orders} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'pending').length} 
                      style={{ backgroundColor: '#faad14' }}
                    >
                      <span>Pending</span>
                    </Badge>
                  } 
                  key="pending"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'pending')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'verified').length} 
                      style={{ backgroundColor: '#52c41a' }}
                    >
                      <span>Verified</span>
                    </Badge>
                  } 
                  key="verified"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'verified')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'cancelled').length} 
                      style={{ backgroundColor: '#f5222d' }}
                    >
                      <span>Cancelled</span>
                    </Badge>
                  } 
                  key="cancelled"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'cancelled')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
              </Tabs>
            </>
          )}
        </Content>
      </Layout>

      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={orderDetailsVisible}
        onCancel={() => setOrderDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrderDetailsVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Order #{selectedOrder.orderId.substring(6, 14)}</h3>
                <p className="text-gray-500">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
                <Select 
                  style={{ width: 140, marginLeft: 8 }} 
                  placeholder="Update Status"
                  onChange={(value) => updateOrderStatus(selectedOrder.orderId, value)}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="verified">Verified</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </div>
            </div>
            
            <div className="border-t border-b py-4">
              <h4 className="font-medium mb-2">Customer Information</h4>
              <p>Name: {selectedOrder.userName}</p>
              <p>Phone: {selectedOrder.userId}</p>
            </div>
            
            <div className="border-b py-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-medium mt-4">
                <span>Total Amount</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
            
            <div className="border-b py-4">
              <h4 className="font-medium mb-2">Payment Information</h4>
              <p>Transaction ID: {selectedOrder.transactionId}</p>
              <div className="mt-2">
                <p className="mb-1">Payment Proof:</p>
                <Image 
                  src={selectedOrder.paymentProof} 
                  alt="Payment Proof" 
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              {selectedOrder.status === 'pending' && (
                <Button 
                  type="primary" 
                  onClick={() => updateOrderStatus(selectedOrder.orderId, 'verified')}
                >
                  Verify Order
                </Button>
              )}
              {selectedOrder.status === 'pending' && (
                <Popconfirm 
                  title="Are you sure you want to cancel this order?" 
                  onConfirm={() => updateOrderStatus(selectedOrder.orderId, 'cancelled')}
                >
                  <Button danger>Cancel Order</Button>
                </Popconfirm>
              )}
            </div>
            </div>
        )}
      </Modal>

      {/* Chat Modal for Enquiries */}
      <Modal
        title="Enquiry Conversation"
        open={chatModalVisible}
        onCancel={() => setChatModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentEnquiryId && (
          <div>
            {enquiries.find(e => e.id === currentEnquiryId) && (
              <div>
                <Card title="Enquiry Details" style={{ marginBottom: 16 }}>
                  <p><strong>Name:</strong> {enquiries.find(e => e.id === currentEnquiryId).name}</p>
                  <p><strong>Phone:</strong> {enquiries.find(e => e.id === currentEnquiryId).phone}</p>
                  <p><strong>Location:</strong> {enquiries.find(e => e.id === currentEnquiryId).location}</p>
                  <p><strong>Looking For:</strong> {enquiries.find(e => e.id === currentEnquiryId).lookingFor}</p>
                  <p><strong>Remarks:</strong> {enquiries.find(e => e.id === currentEnquiryId).remarks}</p>
                  <p><strong>Date:</strong> {new Date(enquiries.find(e => e.id === currentEnquiryId).date).toLocaleString()}</p>
                </Card>
                
<div className="chat-container" style={{ 
  maxHeight: '400px', 
  overflowY: 'auto', 
  padding: '16px', 
  border: '1px solid #f0f0f0', 
  borderRadius: '8px', 
  marginBottom: '16px',
  backgroundColor: '#f9f9f9'
}}>
  {(!enquiries.find(e => e.id === currentEnquiryId).messages || 
    enquiries.find(e => e.id === currentEnquiryId).messages.length === 0) ? (
    <div className="text-center my-8">
      <div style={{ color: '#999', fontSize: '16px' }}>No messages yet</div>
      <div style={{ color: '#bbb', fontSize: '14px', marginTop: '8px' }}>Start the conversation by sending a message below</div>
    </div>
  ) : (
    <div>
      {enquiries.find(e => e.id === currentEnquiryId).messages.map((message, index) => {
        const isAdmin = message.sender === 'admin';
        return (
          <div key={index} style={{ 
            marginBottom: '16px',
            display: 'flex',
            flexDirection: isAdmin ? 'row' : 'row-reverse',
          }}>
            <div style={{ 
              marginRight: isAdmin ? '12px' : '0',
              marginLeft: isAdmin ? '0' : '12px',
            }}>
              <Avatar 
                style={{ 
                  backgroundColor: isAdmin ? '#1890ff' : '#52c41a',
                  color: '#fff',
                }}
              >
                {isAdmin ? 'A' : 'U'}
              </Avatar>
            </div>
            <div style={{ 
              maxWidth: '70%',
            }}>
              <div style={{ 
                backgroundColor: isAdmin ? '#e6f7ff' : '#f6ffed',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                position: 'relative',
                border: isAdmin ? '1px solid #91caff' : '1px solid #b7eb8f',
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px', color: isAdmin ? '#1890ff' : '#52c41a' }}>
                  {message.senderName}
                </div>
                <div style={{ color: '#333' }}>{message.text}</div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#999', 
                  marginTop: '6px', 
                  textAlign: 'right'
                }}>
                  {new Date(message.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>

                
                <Form 
                  form={replyForm} 
                  onFinish={sendReply}
                  layout="inline"
                  style={{ display: 'flex', marginTop: '16px' }}
                >
                  <Form.Item 
                    name="reply" 
                    rules={[{ required: true, message: 'Please enter your reply' }]}
                    style={{ flex: 1, marginRight: '8px', marginBottom: 0 }}
                  >
                    <Input.TextArea 
                      placeholder="Type your reply here..." 
                      autoSize={{ minRows: 1, maxRows: 3 }}
                    />
                  </Form.Item>
                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button 
                      type="primary" 
                      htmlType="submit"
                      icon={<SendOutlined />}
                    >
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Update User Modal */}
      <Modal
        title="Update User Information"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        <Form 
          form={userForm} 
          layout="vertical" 
          onFinish={updateUser}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
          >
            <TextArea rows={3} placeholder="Enter address (optional)" />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setUserModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <style jsx>{`
        .replied-row {
          background-color: #f6ffed;
        }
        .new-reply-row {
          background-color: #e6f7ff;
        }
        .ant-card {
          margin-bottom: 16px;
        }
        .ant-card-actions {
          background: #f5f5f5;
        }
        .chat-container::-webkit-scrollbar {
          width: 6px;
        }
        .chat-container::-webkit-scrollbar-thumb {
          background-color: #d9d9d9;
          border-radius: 3px;
        }
        .chat-container::-webkit-scrollbar-track {
          background-color: #f5f5f5;
        }
      `}</style>
    </Layout>
  );
}

export default AdminPage;


