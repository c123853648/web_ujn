import LineChart from '@/components/line-chart';
import { useFetchNextStats } from '@/hooks/chat-hooks';
import { useSetModalState, useTranslate } from '@/hooks/common-hooks';
import { IModalProps } from '@/interfaces/common';
import { IStats } from '@/interfaces/database/chat';
import { formatDate } from '@/utils/date';
import { Button, Card, DatePicker, Flex, Modal, Space, Typography } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import camelCase from 'lodash/camelCase';
import ChatApiKeyModal from '../chat-api-key-modal';
import EmbedModal from '../embed-modal';
import {
  usePreviewChat,
  useSelectChartStatsList,
  useShowEmbedModal,
  usePreviewKnowledge,
} from '../hooks';
import styles from './index.less';

const { Paragraph } = Typography;
const { RangePicker } = DatePicker;

const StatsLineChart = ({ statsType }: { statsType: keyof IStats }) => {
  const { t } = useTranslate('chat');
  const chartList = useSelectChartStatsList();
  const list =
    chartList[statsType]?.map((x) => ({
      ...x,
      xAxis: formatDate(x.xAxis),
    })) ?? [];

  return (
    <div className={styles.chartItem}>
      <b className={styles.chartLabel}>{t(camelCase(statsType))}</b>
      <LineChart data={list}></LineChart>
    </div>
  );
};

const ChatOverviewModal = ({
  visible,
  hideModal,
  id,
  name = '',
  idKey,
}: IModalProps<any> & { id: string; name?: string; idKey: string }) => {
  const { t } = useTranslate('chat');
  const {
    visible: apiKeyVisible,
    hideModal: hideApiKeyModal,
    showModal: showApiKeyModal,
  } = useSetModalState();
  const { embedVisible, hideEmbedModal, showEmbedModal, embedToken } =
    useShowEmbedModal(id, idKey);

  const { pickerValue, setPickerValue } = useFetchNextStats();

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const { handlePreview } = usePreviewChat(id, idKey);

  const { handlePreviewKnowledge } = usePreviewKnowledge(id, idKey);

  return (
    <>
      <Modal
        title={t('overview')}
        open={visible}
        onCancel={hideModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={hideModal}
        width={'100vw'}
        okText={t('close', { keyPrefix: 'common' })}
      >
        <Flex vertical gap={'middle'}>
          <Card title={t('backendServiceApi')}>
            <Flex gap={8} vertical>
              {t('serviceApiEndpoint')}
              <Paragraph
                copyable={{ text: `${location.origin}/v1/api/` }}
                className={styles.linkText}
              >
                {location.origin}/v1/api/
              </Paragraph>
            </Flex>
            <Space size={'middle'}>
              <Button onClick={showApiKeyModal}>{t('apiKey')}</Button>
              <a
                href={
                  'https://github.com/infiniflow/ragflow/blob/main/docs/references/api.md'
                }
                target="_blank"
                rel="noreferrer"
              >
                <Button>{t('apiReference')}</Button>
              </a>
            </Space>
          </Card>
          <Card title={`${name} Web App`}>
            <Flex gap={8} vertical>
              <Space size={'middle'}>
                <Button onClick={handlePreviewKnowledge}>{t('previewKnowledge')}</Button>
                <Button onClick={handlePreview}>{t('preview')}</Button>
                <Button onClick={showEmbedModal}>{t('embedded')}</Button>
              </Space>
            </Flex>
          </Card>

          <Space>
            <b>{t('dateRange')}</b>
            <RangePicker
              disabledDate={disabledDate}
              value={pickerValue}
              onChange={setPickerValue}
              allowClear={false}
            />
          </Space>
          <div className={styles.chartWrapper}>
            <StatsLineChart statsType={'pv'}></StatsLineChart>
            <StatsLineChart statsType={'round'}></StatsLineChart>
            <StatsLineChart statsType={'speed'}></StatsLineChart>
            <StatsLineChart statsType={'thumb_up'}></StatsLineChart>
            <StatsLineChart statsType={'tokens'}></StatsLineChart>
            <StatsLineChart statsType={'uv'}></StatsLineChart>
          </div>
        </Flex>
        {apiKeyVisible && (
          <ChatApiKeyModal
            hideModal={hideApiKeyModal}
            dialogId={id}
            idKey={idKey}
          ></ChatApiKeyModal>
        )}
        <EmbedModal
          token={embedToken}
          visible={embedVisible}
          hideModal={hideEmbedModal}
        ></EmbedModal>
      </Modal>
    </>
  );
};

export default ChatOverviewModal;
