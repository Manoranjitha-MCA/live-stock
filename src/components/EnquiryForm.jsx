import { Button, Form, Input, message } from "antd";
import { ref, push } from "firebase/database";
import { db } from "../firebase";

const EnquiryForm = ({ userPhone }) => {
  const [form] = Form.useForm();

  const submitEnquiry = async (values) => {
    try {
      await push(ref(db, "enquiries"), {
        ...values,
        userPhone,
        isContacted: false,
        createdAt: new Date().toISOString(), // Add timestamp
      });
      message.success("Enquiry Submitted Successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={submitEnquiry}>
      <h2 className="text-xl font-semibold mb-4">Contact & Enquiry</h2>

      <Form.Item name="name" rules={[{ required: true, message: "Enter Name" }]}>
        <Input placeholder="Your Name" />
      </Form.Item>

      <Form.Item
        name="mobile"
        rules={[
          { required: true, message: "Enter Mobile Number" },
          { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
        ]}
      >
        <Input placeholder="Mobile Number" maxLength={10} />
      </Form.Item>

      <Form.Item name="message" rules={[{ required: true, message: "Enter Message" }]}>
        <Input.TextArea placeholder="Your Message" rows={4} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Submit Enquiry
      </Button>
    </Form>
  );
};

export default EnquiryForm;
