import React from 'react';
import {Row, Col} from 'antd';
import GGEditor, {Flow} from 'gg-editor';
import {FormattedMessage} from 'umi-plugin-react/locale';
import EditorMinimap from '../components/EditorMinimap';
import {FlowContextMenu} from '../components/EditorContextMenu';
import {FlowToolbar} from '../components/EditorToolbar';
import {FlowItemPanel} from '../components/EditorItemPanel';
import {FlowDetailPanel} from '../components/EditorDetailPanel';
import styles from './index.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

GGEditor.setTrackable(false);
import F from './../../../../../icons/ftp.png';

const data = {
    nodes: [{
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '起止节点',
        x: 55,
        y: 55,
        id: 'ea1184e8',
        index: 0,
    }, {
        type: 'node',
        size: '70*70',
        color: '#FA8C16',
        x: 255,
        y: 155,
        id: '481fbb1a',
        index: 2,
        shape: 'image',
        img: 'https://gw.alipayobjects.com/zos/rmsportal/XuVpGqBFxXplzvLjJBZB.svg',
        label: 'image',
    }, {
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '结束节点',
        x: 255,
        y: 55,
        id: 'a',
        index: 3,
    }, {
        type: 'node',
        size: '70*70',
        shape: 'flow-circle',
        color: '#FA8C16',
        label: '结束节点',
        x: 255,
        y: 255,
        id: 'b',
        index: 4,
    }],
    edges: [{
        source: 'ea1184e8',
        sourceAnchor: 1,
        target: '481fbb1a',
        targetAnchor: 3,
        id: '7989ac710',
        index: 1,
    }, {
        source: 'ea1184e8',
        sourceAnchor: 1,
        target: 'b',
        targetAnchor: 3,
        id: '7989ac720',
        index: 2,
    }, {
        source: 'ea1184e8',
        sourceAnchor: 1,
        target: 'a',
        targetAnchor: 3,
        id: '7989ac730',
        index: 3,
    }],
};

const FlowPage = () => {
    return (
        <PageHeaderWrapper
            title={<FormattedMessage id="app.editor.flow.title"/>}
            content={<FormattedMessage id="app.editor.flow.description"/>}
        >
            <GGEditor className={styles.editor}>
                <Row type="flex" className={styles.editorHd}>
                    <Col span={24}>
                        {/* 功能按钮 */}
                        <FlowToolbar/>
                    </Col>
                </Row>
                <Row type="flex" className={styles.editorBd}>
                    <Col span={4} className={styles.editorSidebar}>
                        {/* 四类按钮样式*/}
                        <FlowItemPanel/>
                    </Col>
                    <Col span={16} className={styles.editorContent}>
                        <Flow data={data} className={styles.flow}/>
                    </Col>
                    <Col span={4} className={styles.editorSidebar}>
                        <FlowDetailPanel/>
                        {/* MiniMap */}
                        <EditorMinimap/>
                    </Col>
                </Row>
                <FlowContextMenu/>
            </GGEditor>
        </PageHeaderWrapper>
    );
};

export default FlowPage;
