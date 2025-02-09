// apiDiscussion.js
import apiRequest from "../apiRequest"
// const BASE_URL = "http://127.0.0.1:5000";

/**
 * General API request function that handles all API calls.
 * Uses credentials: "include" to ensure JWT authentication via cookies.
 */
// async function apiRequest(endpoint, method = "GET", body = null) {
//     const options = {
//         method,
//         headers: {
//             "Content-Type": "application/json"
//         },
//         credentials: "include" // Ensures cookies (JWT) are sent
//     };

//     if (body) {
//         options.body = JSON.stringify(body);
//     }

//     try {
//         const response = await fetch(`${BASE_URL}${endpoint}`, options);

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || "Request failed");
//         }

//         return await response.json();
//     } catch (error) {
//         console.error("API Error:", error.message);
//         throw error;
//     }
// }

/**
 * Fetch all questions
 * @returns {Promise<Array>} List of questions
 */
async function fetchAllQuestions() {
    return await apiRequest("/questions");
}

/**
 * Fetch all answers for a specific question
 * @param {string} questionId - The UUID of the question
 * @returns {Promise<Array>} List of answers
 */
async function fetchAnswersForQuestion(questionId) {
    return await apiRequest(`/questions/${questionId}/answers`);
}

/**
 * Add an answer to a specific question
 * @param {string} questionId - The UUID of the question
 * @param {string} body - The answer text
 * @returns {Promise<Object>} Response message
 */
async function addAnswer(questionId, body) {
    return await apiRequest(`/questions/${questionId}/answers`, "POST", { body });
}

/**
 * Update an existing answer
 * @param {string} answerId - The UUID of the answer
 * @param {string} body - The new answer text
 * @returns {Promise<Object>} Response message
 */
async function updateAnswer(answerId, body) {
    return await apiRequest(`/answers/${answerId}`, "PUT", { body });
}

/**
 * Delete an answer
 * @param {string} answerId - The UUID of the answer
 * @returns {Promise<Object>} Response message
 */
async function deleteAnswer(answerId) {
    return await apiRequest(`/answers/${answerId}`, "DELETE");
}

/**
 * Toggle upvote for an answer (adds or removes upvote)
 * @param {string} answerId - The UUID of the answer
 * @returns {Promise<Object>} Response message
 */
async function toggleUpvote(answerId) {
    return await apiRequest(`/answers/${answerId}/upvote`, "POST");
}

/**
 * Fetch a specific question by ID
 * @param {string} questionId - The UUID of the question
 * @returns {Promise<Object>} Question details
 */
async function getQuestion(questionId) {
    return await apiRequest(`/questions/${questionId}`);
}

/**
 * Add a new question
 * @param {string} title - The question title
 * @param {string} body - The question description
 * @returns {Promise<Object>} Response message
 */
async function addQuestion(title, body) {
    return await apiRequest(`/questions`, "POST", { title, body });
}

/**
 * Edit an existing question
 * @param {string} questionId - The UUID of the question
 * @param {string} title - The updated title
 * @param {string} body - The updated body
 * @returns {Promise<Object>} Response message
 */
async function editQuestion(questionId, title, body) {
    return await apiRequest(`/questions/${questionId}`, "PUT", { title, body });
}

/**
 * Delete a question
 * @param {string} questionId - The UUID of the question
 * @returns {Promise<Object>} Response message
 */
async function deleteQuestion(questionId) {
    return await apiRequest(`/questions/${questionId}`, "DELETE");
}

// Export functions for use in other files
export {
    fetchAllQuestions,
    fetchAnswersForQuestion,
    addAnswer,
    updateAnswer,
    deleteAnswer,
    toggleUpvote,
    getQuestion,
    addQuestion,
    editQuestion,
    deleteQuestion
};
