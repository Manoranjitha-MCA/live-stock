import QRCode from "qrcode.react"; // Install: npm install qrcode.react

const handlePayment = () => {
  toast.info("Scan the QR code to complete the payment.");
  setShowQR(true); // Show the QR code
};

return (
  <Layout style={{ minHeight: "100vh" }}>
    {/* Sidebar */}
    <Sider theme="dark" collapsible>
      <Menu theme="dark" mode="inline" selectedKeys={[selectedMenu]} onClick={(e) => setSelectedMenu(e.key)}>
        <Menu.Item key="products" icon={<ShoppingOutlined />}>Products</Menu.Item>
        <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>Cart ({cart.length})</Menu.Item>
        <Menu.Item key="enquiry" icon={<FormOutlined />}>Enquiry</Menu.Item>
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => navigate("/")}>Logout</Menu.Item>
      </Menu>
    </Sider>

    {/* Main Content */}
    <Layout>
      <Content className="p-5">
        <h2 className="text-2xl font-semibold">Welcome, {user?.name} ({userPhone})</h2>

        {/* Cart Section */}
        {selectedMenu === "cart" && (
          <>
            <h2 className="text-xl font-semibold my-4">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.id} className="bg-white shadow-md p-4 mb-2 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <p className="text-gray-600">₹{item.amount} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center">
                      <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md" onClick={() => decreaseQuantity(item.id)}>
                        <MinusCircleOutlined />
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md" onClick={() => increaseQuantity(item.id)}>
                        <PlusCircleOutlined />
                      </button>
                    </div>
                  </div>
                ))}
                <h3 className="text-lg font-semibold my-3">
                  Total: ₹{cart.reduce((acc, item) => acc + item.amount * item.quantity, 0)}
                </h3>

                {/* Show QR Code */}
                {showQR ? (
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-semibold my-2">Scan to Pay</p>
                    <QRCode value="upi://pay?pa=krishsachin87-1@okaxis&pn=Shop%20Name&mc=0000&mode=02&purpose=00" size={200} />
                    <p className="text-gray-600 mt-2">UPI ID: krishsachin87-1@okaxis</p>
                    <button className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md" onClick={() => {
                      toast.success("Payment Verified!");
                      setCart([]); // Clear cart
                      setShowQR(false);
                    }}>
                      Payment Done
                    </button>
                  </div>
                ) : (
                  <Button type="primary" className="w-full" onClick={handlePayment}>
                    Proceed to Payment
                  </Button>
                )}
              </>
            )}
          </>
        )}
      </Content>
    </Layout>
    <ToastContainer />
  </Layout>
);
