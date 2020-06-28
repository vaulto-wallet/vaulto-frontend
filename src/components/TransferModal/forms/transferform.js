import { Form, Input, InputNumber, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const TransferForm = (props) => {
  const onFinish = values => {
    console.log('Received values of form:', values);
  };

  console.log("TransferForm", props)

  return (
    <Form ref={props.formRef} name="dynamic_form_nest_item" onFinish={onFinish} autoComplete="off">
        <Form.Item label="Comment" name='comment'  rules={[{ required: true, message: 'Comment field is required!' }]}>
            <Input/>
        </Form.Item>


      <Form.List name="destinations">
        {(fields, { add, remove }) => {
            if(fields.length == 0 ){
                add();
            }

            return (
            <div>
              {fields.map(field => (
                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                  <Form.Item
                    {...field}
                    name={[field.name, 'address_to']}
                    fieldKey={[field.fieldKey, 'address_to']}
                    rules={[{ required: true, message: 'Missing destination address' }]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    name={[field.name, 'amount']}
                    fieldKey={[field.fieldKey, 'amount']}
                    rules={[{ required: true, message: 'Missing amount' }]}
                  >
                    <InputNumber placeholder="Amount" />
                  </Form.Item>

                  <MinusCircleOutlined
                    onClick={() => {
                      if(fields.length > 1){
                        remove(field.name);
                      }
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  block
                >
                  <PlusOutlined /> Add transfer
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>

    </Form>
  );
};




export default TransferForm;