import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {fakeSubmitForm} from '@/services/api';

export default {
    namespace: 'newForm',

    state: {
        step: {
            payAccount: 'ant-design@alipay.com',
            receiverAccount: 'test@example.com',
            receiverName: 'Alex',
            amount: '500',
        },
    },

    effects: {
        * submitRegularForm({payload}, {call}) {
            yield call(fakeSubmitForm, payload);
            message.success('提交成功');
        },
        * submitStepForm({payload}, {call, put}) {
            yield call(fakeSubmitForm, payload);
            yield put({
                type: 'saveStepFormData',
                payload,
            });
            yield put(routerRedux.push('/dataTask/step-form/rule'));
        },
        * submitAdvancedForm({payload}, {call}) {
            yield call(fakeSubmitForm, payload);
            message.success('提交成功');
        },
        * createNewTaskAction(_, {put}) {
            yield put(
                routerRedux.replace({
                    pathname: '/dataTask/step-form/sourceType',
                })
            );
        },
    },

    reducers: {
        saveStepFormData(state, {payload}) {
            return {
                ...state,
                step: {
                    ...state.step,
                    ...payload,
                },
            };
        },
    },
};
