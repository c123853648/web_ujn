import { ReactComponent as ChatAppCube } from '@/assets/svg/chat-app-cube.svg';
import RenameModal from '@/components/rename-modal';
import {
    CloudOutlined,
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Card,
    Divider,
    Dropdown,
    Flex,
    MenuProps,
    Space,
    Spin,
    Tag,
    Typography,
} from 'antd';
import Header from '@/layouts/components/easy-header';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import classNames from 'classnames';
import React, { useCallback } from 'react';
import ChatConfigurationModal from '../chat-configuration-modal';
import ChatContainer from '../chat-container';
import {
    useClickConversationCard,
    useDeleteConversation,
    useDeleteDialog,
    useEditDialog,
    useHandleItemHover,
    useRenameConversation,
    useSelectDerivedConversationList,
} from '../hooks';

import ChatOverviewModal from '@/components/api-service/chat-overview-modal';
import {
    useClickDialogCard,
    useFetchNextDialogList,
    useGetChatSearchParams,
} from '@/hooks/chat-hooks';
import { useSetModalState, useTranslate } from '@/hooks/common-hooks';
import { useSetSelectedRecord } from '@/hooks/logic-hooks';
import { IDialog } from '@/interfaces/database/chat';
import styles from '../index.less';

const { Text } = Typography;

const Chat = () => {
    const { data: dialogList, loading: dialogLoading } = useFetchNextDialogList();
    const { onRemoveDialog } = useDeleteDialog();
    const { onRemoveConversation } = useDeleteConversation();
    const { handleClickDialog } = useClickDialogCard();
    const { handleClickConversation } = useClickConversationCard();
    const { dialogId, conversationId } = useGetChatSearchParams();
    const {
        list: conversationList,
        addTemporaryConversation,
        loading: conversationLoading,
    } = useSelectDerivedConversationList();
    const { activated, handleItemEnter, handleItemLeave } = useHandleItemHover();
    const {
        activated: conversationActivated,
        handleItemEnter: handleConversationItemEnter,
        handleItemLeave: handleConversationItemLeave,
    } = useHandleItemHover();
    const {
        conversationRenameLoading,
        initialConversationName,
        onConversationRenameOk,
        conversationRenameVisible,
        hideConversationRenameModal,
        showConversationRenameModal,
    } = useRenameConversation();
    const {
        dialogSettingLoading,
        initialDialog,
        onDialogEditOk,
        dialogEditVisible,
        clearDialog,
        hideDialogEditModal,
        showDialogEditModal,
    } = useEditDialog();
    const { t } = useTranslate('chat');
    const {
        visible: overviewVisible,
        hideModal: hideOverviewModal,
        showModal: showOverviewModal,
    } = useSetModalState();
    const { currentRecord, setRecord } = useSetSelectedRecord<IDialog>();

    const handleAppCardEnter = (id: string) => () => {
        handleItemEnter(id);
    };

    const handleConversationCardEnter = (id: string) => () => {
        handleConversationItemEnter(id);
    };

    const handleShowChatConfigurationModal =
        (dialogId?: string): any =>
            (info: any) => {
                info?.domEvent?.preventDefault();
                info?.domEvent?.stopPropagation();
                showDialogEditModal(dialogId);
            };

    const handleRemoveDialog =
        (dialogId: string): MenuItemProps['onClick'] =>
            ({ domEvent }) => {
                domEvent.preventDefault();
                domEvent.stopPropagation();
                onRemoveDialog([dialogId]);
            };

    const handleShowOverviewModal =
        (dialog: IDialog): any =>
            (info: any) => {
                info?.domEvent?.preventDefault();
                info?.domEvent?.stopPropagation();
                setRecord(dialog);
                showOverviewModal();
            };

    const handleRemoveConversation =
        (conversationId: string): MenuItemProps['onClick'] =>
            ({ domEvent }) => {
                domEvent.preventDefault();
                domEvent.stopPropagation();
                onRemoveConversation([conversationId]);
            };

    const handleShowConversationRenameModal =
        (conversationId: string): MenuItemProps['onClick'] =>
            ({ domEvent }) => {
                domEvent.preventDefault();
                domEvent.stopPropagation();
                showConversationRenameModal(conversationId);
            };

    const handleDialogCardClick = (dialogId: string) => () => {
        handleClickDialog(dialogId);
    };

    const handleConversationCardClick = (dialogId: string) => () => {
        handleClickConversation(dialogId);
    };

    const handleCreateTemporaryConversation = useCallback(() => {
        addTemporaryConversation();
    }, [addTemporaryConversation]);

    const items: MenuProps['items'] = [
        {
            key: '1',
            onClick: handleCreateTemporaryConversation,
            label: (
                <Space>
                    <PlusOutlined />
                    {t('newChat')}
                </Space>
            ),
        },
    ];

    const buildAppItems = (dialog: IDialog) => {
        const dialogId = dialog.id;

        const appItems: MenuProps['items'] = [
            {
                key: '1',
                onClick: handleShowChatConfigurationModal(dialogId),
                label: (
                    <Space>
                        <EditOutlined />
                        {t('edit', { keyPrefix: 'common' })}
                    </Space>
                ),
            },
            { type: 'divider' },
            {
                key: '2',
                onClick: handleRemoveDialog(dialogId),
                label: (
                    <Space>
                        <DeleteOutlined />
                        {t('delete', { keyPrefix: 'common' })}
                    </Space>
                ),
            },
            { type: 'divider' },
            {
                key: '3',
                onClick: handleShowOverviewModal(dialog),
                label: (
                    <Space>
                        <CloudOutlined />
                        {t('overview')}
                    </Space>
                ),
            },
        ];

        return appItems;
    };

    const buildConversationItems = (conversationId: string) => {
        const appItems: MenuProps['items'] = [
            {
                key: '1',
                onClick: handleShowConversationRenameModal(conversationId),
                label: (
                    <Space>
                        <EditOutlined />
                        {t('rename', { keyPrefix: 'common' })}
                    </Space>
                ),
            },
            { type: 'divider' },
            {
                key: '2',
                onClick: handleRemoveConversation(conversationId),
                label: (
                    <Space>
                        <DeleteOutlined />
                        {t('delete', { keyPrefix: 'common' })}
                    </Space>
                ),
            },
        ];

        return appItems;
    };

    return (
        <div className={styles.chatContainer}>
            <Header></Header>
            <Divider style={{margin: 0,}}></Divider>
            <Flex className={styles.chatWrapper}>
                <Flex className={styles.chatTitleWrapper}>
                    <Flex flex={1} vertical>
                        <Flex
                            justify={'space-between'}
                            align="center"
                            className={styles.chatTitle}
                        >
                            <Space>
                                <b>{t('chat')}</b>
                                <Tag>{conversationList.length}</Tag>
                            </Space>
                            <Dropdown menu={{ items }}>
                                {/* <FormOutlined /> */}
                                <PlusOutlined />
                            </Dropdown>
                        </Flex>
                        <Divider></Divider>
                        <Flex vertical gap={10} className={styles.chatTitleContent}>
                            <Spin
                                spinning={conversationLoading}
                                wrapperClassName={styles.chatSpin}
                            >
                                {conversationList.map((x) => (
                                    <Card
                                        key={x.id}
                                        hoverable
                                        onClick={handleConversationCardClick(x.id)}
                                        onMouseEnter={handleConversationCardEnter(x.id)}
                                        onMouseLeave={handleConversationItemLeave}
                                        className={classNames(styles.chatTitleCard, {
                                            [styles.chatTitleCardSelected]: x.id === conversationId,
                                        })}
                                    >
                                        <Flex justify="space-between" align="center">
                                            <div>
                                                <Text
                                                    ellipsis={{ tooltip: x.name }}
                                                    style={{ width: 150 }}
                                                >
                                                    {x.name}
                                                </Text>
                                            </div>
                                            {conversationActivated === x.id && x.id !== '' && (
                                                <section>
                                                    <Dropdown
                                                        menu={{ items: buildConversationItems(x.id) }}
                                                    >
                                                        <ChatAppCube
                                                            className={styles.cubeIcon}
                                                        ></ChatAppCube>
                                                    </Dropdown>
                                                </section>
                                            )}
                                        </Flex>
                                    </Card>
                                ))}
                            </Spin>
                        </Flex>
                    </Flex>
                </Flex>
                <Divider type={'vertical'} className={styles.divider}></Divider>
                <ChatContainer></ChatContainer>
                {dialogEditVisible && (
                    <ChatConfigurationModal
                        visible={dialogEditVisible}
                        initialDialog={initialDialog}
                        showModal={showDialogEditModal}
                        hideModal={hideDialogEditModal}
                        loading={dialogSettingLoading}
                        onOk={onDialogEditOk}
                        clearDialog={clearDialog}
                    ></ChatConfigurationModal>
                )}
                <RenameModal
                    visible={conversationRenameVisible}
                    hideModal={hideConversationRenameModal}
                    onOk={onConversationRenameOk}
                    initialName={initialConversationName}
                    loading={conversationRenameLoading}
                ></RenameModal>
                {overviewVisible && (
                    <ChatOverviewModal
                        visible={overviewVisible}
                        hideModal={hideOverviewModal}
                        id={currentRecord.id}
                        name={currentRecord.name}
                        idKey="dialogId"
                    ></ChatOverviewModal>
                )}
            </Flex>
        </div>
    );
};

export default Chat;
