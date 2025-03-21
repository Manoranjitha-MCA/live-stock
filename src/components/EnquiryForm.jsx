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
        createdAt: new Date().toISOString(), // Timestamp
      });
      message.success("Enquiry Submitted Successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={submitEnquiry}>
      <h2 className="text-xl font-semibold mb-4">Enquiry Form</h2>

      <Form.Item name="name" rules={[{ required: true, message: "Enter Name" }]}>
        <Input placeholder="Name" />
      </Form.Item>

      <Form.Item name="location" rules={[{ required: true, message: "Enter Location" }]}>
        <Input placeholder="Location" />
      </Form.Item>

      <Form.Item
        name="phone"
        rules={[
          { required: true, message: "Enter Phone Number" },
          { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
        ]}
      >
        <Input placeholder="Phone Number" maxLength={10} />
      </Form.Item>

      <Form.Item name="lookingFor" rules={[{ required: true, message: "Enter what they are looking for" }]}>
        <Input.TextArea placeholder="What are they looking for?" rows={3} />
      </Form.Item>

      <Form.Item name="remarks">
        <Input.TextArea placeholder="Remarks (Optional)" rows={3} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Submit Enquiry
      </Button>
    </Form>
  );
};

export default EnquiryForm;
