import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { QuestionsResponse } from "./Questions";
import { AuthContext } from "../context/AuthContext";

interface AnswerOptions {
  answer: string;
  username: string;
  likes: [];
  id: string;
}
export const SingleQuestion = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [answer, setAnswer] = useState("");
  // @ts-ignore
  const { isLogin }: { isLogin: boolean } = useContext(AuthContext);
  const [question, setQuestion] = useState({
    views: 0,
    owner: "",
    question: "",
    description: "",
    tags: "",
    answers: [],
  });
  const getQuestion = () => {
    axios
      .get<QuestionsResponse>(
        `https://fabbbbr.herokuapp.com/api/question/${path}`
      )
      .then((res) => {
        const { views, owner, question, description, tags, answers } = res.data;
        setQuestion({
          views,
          owner,
          question,
          description,
          tags,
          answers,
        });
      });
  };
  const postAnswer = async () => {
    await axios.post(
      `https://fabbbbr.herokuapp.com/api/question/answer/${path}`,
      {
        answer,
        username: localStorage.getItem("username"),
      }
    );
    getQuestion();
  };

  const likeAnswer = async (id: string) => {
    await axios.post(
      `https://fabbbbr.herokuapp.com/api/question/like-answer/${path}`,
      {
        answerId: id,
        username: localStorage.getItem("username"),
      }
    );
    getQuestion();
  };

  useEffect(() => {
    getQuestion();
  }, []);
  return (
    <div className="sing">
      <div className="container question">
        <div className="question-wrapper">
          <div className="username-wrapper">
            <p className="username">@{question.owner}</p>
          </div>
          <div className="tags">
            <p className="tag">{question.tags}</p>
          </div>
          <div className="question-wrapper">
            <h4 className="question">{question.question}</h4>
            <div className="question-desc">
              <p className="question-description">{question.description}</p>
            </div>
          </div>
          <div className="views">
            <p className="view-count">{question.views} просмотров</p>
          </div>
          <div className="your-answer-wrapper">
            <p className="your-answer">Ваш ответ на вопрос</p>
          </div>
          {question.answers.length
            ? question.answers.map((item: AnswerOptions) => {
                return (
                  <div className="answers">
                    <div className="answer-username-wrapper">
                      <p className="answer-username">@{item.username}</p>
                    </div>
                    <div className="answer-wrapper">
                      <p className="answer">{item.answer}</p>
                    </div>
                    <button
                      className="btn"
                      onClick={() => likeAnswer(item.id)}
                      disabled={!isLogin}
                    >
                      Нравится | {item.likes.length}
                    </button>
                  </div>
                );
              })
            : null}
          {isLogin ? (
            <div className="answer-group">
              <textarea
                className="text-area-input"
                onChange={(e) => setAnswer(e.target.value)}
              />
              <br />
              <button className="btn" onClick={() => postAnswer()}>
                Опубликовать
              </button>
            </div>
          ) : (
            <Link to="/login">Войти чтобы ответить на вопрос</Link>
          )}
        </div>
      </div>
    </div>
  );
};