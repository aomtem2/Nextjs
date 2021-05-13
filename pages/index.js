import React from 'react'
import 'antd/dist/antd.css';
import { useForm } from "react-hook-form";
import { Table, Tag, Space, Button, Form, Input, Modal, Select, Option } from 'antd';
import axios from "axios"
import { useState, useEffect, useMemo } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function mainP() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [currentID, changeID] = useState(0);
  const [position, changeSelect] = useState('Staff');
  const [position1, changeSelect1] = useState('Staff');
  const [currentName, changeName] = useState('');
  const [currentEmail, changeEmail] = useState({});
  const [table, setTable] = useState('')
  const [change, onTableChange] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { confirm } = Modal;

  const getTable = async () => {
    await axios.get(`http://localhost:8000/administrator/getUser`)
      .then(response => {
        // console.log(response.data.payload)
        onTableChange(false);
        setTable(response.data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getTable()
  }, [change])

  const handleChangeSelect = (value) => {
    changeSelect(value)
  }

  const handleChangeSelect1 = (value) => {
    changeSelect1(value)
  }

  const showModal = (rec) => {
    changeID(rec.id)
    changeName(rec.name)
    changeEmail(rec.email)
    setIsModalVisible(true);
    console.log(currentID)
  };

  const showModal1 = (rec) => {
    setIsModalVisible1(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk1 = () => {
    setIsModalVisible1(false);
  };

  const handleCancel1 = () => {
    setIsModalVisible1(false);
  };

  const deleteUser = async (id) => {
    console.log('delete' + id);
    await axios
      .delete(`http://localhost:8000/administrator/delete/${String(id)}`)
      .then(response => {
        console.log(response.data)
        onTableChange(true);
      })
      .catch(err => {
        console.error(err)
      })
  }

  const showDeleteConfirm = (rec) => {
    changeID(rec.id)
    confirm({
      title: 'Are you sure delete this?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(rec.id)
      },
      onCancel() {

      },
    });
  }

  const addUser = async (body) => {
    body.position = position1
    console.log(body)
    await axios.post(`http://localhost:8000/administrator/create`, {
      name: body.name,
      email: body.email,
      password: body.password,
      type: body.position
    }).then(response => {
      console.log("response: ", response)
      document.getElementById("formInsert").reset();
      setIsModalVisible1(false);
      onTableChange(true);
    }).catch(err => {
      console.error(err)
    })
  }

  const updateUser = async (body) => {
    body.position = position
    console.log(body)
    await axios.put(`http://localhost:8000/administrator/update/${String(currentID)}`, {
      name: body.name,
      email: body.email,
      password: body.password,
      type: body.position
    }).then(response => {
      console.log("response: ", response)
      document.getElementById("formUpdate").reset();
      setIsModalVisible(false);
      onTableChange(true);
    }).catch(err => {
      console.error(err)
    })
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: "id"
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Position',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showModal(record)}>Edit</Button>
          <Button type="primary" danger onClick={() => showDeleteConfirm(record)}>Delete</Button>
        </Space >
      ),
    },
  ];

  return (
    <div style={{ textAlign: 'center', margin: 'auto', width: '70%' }}>
      <h1>Table</h1>
      {/* <span>{JSON.stringify(table)}</span> */}
      <Button type="primary" style={{ float: 'right' }} onClick={() => showModal1()} >+ AddUser</Button>
      <Table rowKey={obj => obj.id} columns={columns} dataSource={table} />
      <Modal title="Update" onOk={handleOk} onCancel={handleCancel} visible={isModalVisible} footer={[]}>
        <form id='formUpdate' onSubmit={handleSubmit(updateUser)}>
          <Form.Item label="Name" >
            <Input id="name" placeholder={currentName} {...register("name")}
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]} />
          </Form.Item>
          <Form.Item label="Email" >
            <Input id="email" placeholder={currentEmail} {...register("email")}
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]} />
          </Form.Item>
          <Form.Item label="Password">
            <Input.Password id="password" {...register("password")}
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]} />
          </Form.Item>
          <Form.Item label="Position" >
            <Select defaultValue="Staff" style={{ width: 220 }}  {...register("position")} onChange={handleChangeSelect}>
              <Select.Option value="Staff">Staff</Select.Option>
              <Select.Option value="Supervisor">Supervisor</Select.Option>
              <Select.Option value="HR administrator">HR administrator</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="login-form-button" style={{ float: 'right' }}>
            Update
                    </Button>
        </form>
      </Modal>
      <Modal title="AddUser" onOk={handleOk1} onCancel={handleCancel1} visible={isModalVisible1} footer={[]}>
        <form id='formInsert' onSubmit={handleSubmit(addUser)}>
          <Form.Item label="Name" >
            <Input id="name" {...register("name")}
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]} />
          </Form.Item>

          <Form.Item label="Email" >
            <Input id="email" {...register("email")}
              rules={[
                {
                  required: true,
                  message: 'Please input your username!',
                },
              ]} />
          </Form.Item>

          <Form.Item label="Password">
            <Input.Password id="password" {...register("password")}
              rules={[
                {
                  required: true,
                  message: 'Please input your password!',
                },
              ]} />
          </Form.Item>

          <Form.Item label="Position" >
            <Select defaultValue="Staff" style={{ width: 220 }}  {...register("position")} onChange={handleChangeSelect1}>
              <Select.Option value="Staff">Staff</Select.Option>
              <Select.Option value="Supervisor">Supervisor</Select.Option>
              <Select.Option value="HR">HR administrator</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="login-form-button" style={{ float: 'right' }}>
            Submit
                </Button>
        </form>
      </Modal>
    </div>
  )
}

