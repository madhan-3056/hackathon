import {
    GET_MESSAGES,
    SEND_MESSAGE,
    MESSAGE_ERROR,
    CLEAR_CHAT,
    SET_LOADING
} from '../types';

const chatReducer = (state, action) => {
    switch (action.type) {
        case GET_MESSAGES:
            return {
                ...state,
                messages: action.payload,
                loading: false
            };
        case SEND_MESSAGE:
            // Add user message if it exists in payload
            const updatedMessages = action.payload.message
                ? [...state.messages, action.payload.message]
                : [...state.messages];

            // Add AI response if it exists in payload
            const finalMessages = action.payload.aiResponse
                ? [...updatedMessages, action.payload.aiResponse]
                : updatedMessages;

            return {
                ...state,
                messages: finalMessages,
                loading: false
            };
        case CLEAR_CHAT:
            return {
                ...state,
                messages: [],
                loading: false
            };
        case MESSAGE_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case SET_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
};

export default chatReducer;