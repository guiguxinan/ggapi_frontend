import { removeRule, updateRule } from '../../../services/ant-design-pro/api';
import {
  addInterfaceInfoUsingPost,
  listPostByPageUsingPost,
  updateInterfaceInfoUsingPost,
  deleteInterfaceInfoUsingPost,
  onlineInterfaceInfoUsingPost,
  offlineInterfaceInfoUsingPost,
} from '../../../services/ggapi_backend/interfaceInfoController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';

import CreateModal from './components/CreateModal';
import UpdateModal from './components/UpdateModal';

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  // 模态框的变量在TableList组件里，所以把增删改节点都放进来
  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
    // 把参数的类型改成InterfaceInfo
  const handleAdd = async (fields: API.InterfaceInfo) => {
      const hide = message.loading('正在添加');
      try {
        // 把addRule改成addInterfaceInfoUsingPOST
        await addInterfaceInfoUsingPost({
          ...fields,
        });
        hide();
        // 如果调用成功会提示'创建成功'
        message.success('创建成功');
        // 创建成功就关闭这个模态框
        handleModalOpen(false);
        return true;
      } catch (error: any) {
        hide();
        // 否则提示'创建失败' + 报错信息
        message.error('创建失败，' + error.message);
        return false;
      }
    };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  // 把参数的类型改成InterfaceInfo
  const handleUpdate = async (fields: API.InterfaceInfo) => {
    // 如果没有选中行直接返回
    if (!currentRow){
      return;
    }
    // 设置加载中的提示为‘修改中’
    const hide = message.loading('修改中...');
    try {
      // 把updateRule 改成 updateInterfaceInfoUsingPOST
      // 调用更新接口，传入当前行的id和更新的字段
      await updateInterfaceInfoUsingPost({
        id:currentRow.id,
        ...fields,
      });
      hide();
      // 如果调用成功会提示'修改成功'
      message.success('修改成功');
      return true;
    } catch (error) {
      hide();
      // 否则提示‘修改失败’ + 报错信息
      // @ts-ignore
      message.error('修改失败,' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  // 参数类型改为 InterfaceInfo
  const handleRemove = async (record: API.InterfaceInfo) => {
    // 设置加载中的提示为‘正在删除’
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      // 把removeRule 改成 deleteInterfaceInfoUsingPost
      await deleteInterfaceInfoUsingPost({
        // 拿到id就能删除
        id: record.id
      });
      hide();
      // 如果调用成功就提示 删除成功
      message.success('删除成功');
      return true;
    } catch (error) {
      hide();
      // 否则提示 删除失败 + 报错信息
      // @ts-ignore
      message.error('删除失败' + error.message);
      return false;
    }
  };
  /**
   * 发布接口
   *
   * @param record
   */
  const handleOnline = async (record: API.IdRequest) => {
    // 显示正在发布的加载提示
    const hide = message.loading('发布中');
    // 如果接口数据为空，直接返回true
    if (!record) return true;
    try {
      // 调用发布接口的POST请求方法
      await onlineInterfaceInfoUsingPost({
        // 传递接口的id参数
        id: record.id
      });
      hide();
      // 显示操作成功的提示信息
      message.success('操作成功');
      // 重新加载数据
      actionRef.current?.reload();
      // 返回true表示发布成功
      return true;
    } catch (error: any) {
      hide();
      // 显示操作失败的错误提示信息
      message.error('操作失败，' + error.message);
      // 返回false表示发布失败
      return false;
    }
  };
  /**
   * 下线接口
   *
   * @param record
   */
  const handleOffline = async (record: API.IdRequest) => {
    // 显示正在下线的加载提示
    const hide = message.loading('发布中');
    // 如果接口数据为空，直接返回true
    if (!record) return true;
    try {
      // 调用下线接口的POST请求方法
      await offlineInterfaceInfoUsingPost({
        // 传递接口的id参数
        id: record.id
      });
      hide();
      // 显示操作成功的提示信息
      message.success('操作成功');
      // 重新加载数据
      actionRef.current?.reload();
      // 返回true表示下线成功
      return true;
    } catch (error: any) {
      hide();
      // 显示操作失败的错误提示信息
      message.error('操作失败，' + error.message);
      // 返回false表示下线失败
      return false;
    }
  };


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{
          // 必填项
          required: true,
          // 不设置提示信息，就默认提示‘请输入’+title
        }]
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'text',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        1: {
          text: '关闭',
          status: 'Default',
        },
        0: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ?
        <a
          key="offline"
          onClick={() => {
            handleOffline(record);
          }}
        >
          下线
        </a> : null,
        record.status === 1 ?
        <Button
          type="text"
          danger
          key="online"
          onClick={() => {
            handleOnline(record);
          }}
        >
          发布
        </Button> : null,
        <Button
          type="text"
          danger
          key="config"
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (
          params,
          // @ts-ignore
          sort: Record<string, SortOrder>,
          filter: Record<string, React.ReactText[] | null>,
        ) => {
          const res: any = await listPostByPageUsingPost({
            ...params,
          });
          // 如果后端请求给你返回了接口信息
          if (res?.data) {
            // 返回一个包含数据、成功状态和总数的对象
            return {
              data: res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };
          } else {
            // 如果数据不存在，返回一个空数组，失败状态和零总数
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      <UpdateModal
        // 要传递column，不然修改模态框没有表单项
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        // 要传递的信息改为 visible
        visible={updateModalOpen}
        // @ts-ignore
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      {/* 创建一个CreateModal组件，用于在点击新增按钮时弹出 */}
      <CreateModal
        columns={columns}
        // 当取消按钮被点击时,设置更新模态框为false以隐藏模态窗口
        onCancel={() => {
          handleModalOpen(false);
        }}
        // @ts-ignore
        // 当用户点击提交按钮之后，调用handleAdd函数处理提交的数据，去请求后端添加数据(这里的报错不用管,可能里面组件的属性和外层的不一致)
        onSubmit={(values) => {
          handleAdd(values);
        }}
        // 根据更新窗口的值决定模态窗口是否显示
        visible={createModalOpen}
      />
    </PageContainer>
  );
};
export default TableList;
