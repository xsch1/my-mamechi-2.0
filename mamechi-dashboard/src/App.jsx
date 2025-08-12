import { useEffect, useRef, useState } from 'react';
import sad from './assets/mamechiSad.png';
import happy from './assets/mamechiHappy.png';
import './App.css';

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

export default function App() {
  const [like, setLike] = useState(
    () => Number(localStorage.getItem('m_like')) || 0
  );
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem('m_msgs')) || [
          { id: 0, who: 'm', text: '말을 걸어도 호감도가 올라가요.' },
        ]
      );
    } catch {
      return [{ id: 0, who: 'm', text: '말을 걸어도 호감도가 올라가요.' }];
    }
  });

  const atGoal = like >= 100;
  const imgSrc = atGoal ? happy : sad;
  const listRef = useRef(null);

  // 저장
  useEffect(() => {
    localStorage.setItem('m_like', String(like));
    localStorage.setItem('m_msgs', JSON.stringify(msgs.slice(-30)));
  }, [like, msgs]);

  // 스크롤 하단 고정
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [msgs]);

  const addLike = () => setLike((v) => Math.min(v + 1, 100));
  const reset = () => {
    setLike(0);
    setMsgs([{ id: Date.now(), who: 'm', text: '안녕!' }]);
  };

  // 말 걸기
  const onSend = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;

    // 내 메시지
    setMsgs((m) => [...m, { id: Date.now(), who: 'me', text: t }]);
    setText('');

    // 메시지 길이에 따라 +1~5
    const inc = clamp(Math.ceil(t.length / 12), 1, 5);
    setLike((v) => clamp(v + inc, 0, 100));

    // 마메치 답변
    const reply = makeReply(t);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, who: 'm', text: reply }]);
    }, 300 + Math.floor(Math.random() * 400));
  };

  return (
    <>
      <div>
        <img
          src={imgSrc}
          className={`logo ${atGoal ? 'celebrate' : ''}`}
          alt="마메치"
        />
      </div>

      <h1>MAMECHI</h1>

      <div
        className="card"
        style={{
          gap: 12,
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        {/* 진행바 */}
        <div className="progress">
          <div className="bar" style={{ width: `${like}%` }} />
        </div>
        <div style={{ fontSize: 14, opacity: 0.8 }}>호감도: {like}%</div>

        {/* 기존 버튼 */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={addLike} disabled={atGoal}>
            칭찬하기
          </button>
          <button onClick={reset} style={{ opacity: 0.7 }}>
            다시하기
          </button>
        </div>

        {/* 채팅 */}
        <div ref={listRef} className="chat">
          {msgs.map((m) => (
            <div key={m.id} className={`msg ${m.who === 'me' ? 'me' : 'm'}`}>
              {m.text}
            </div>
          ))}
        </div>
        <form onSubmit={onSend} className="row">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="마메치에게... "
          />
          <button type="submit">보내기</button>
        </form>

        {atGoal ? (
          <p style={{ color: '#16a34a', margin: 0 }}>
            마메치가 당신을 좋은 친구로 생각하는 것 같아요. 🎉
          </p>
        ) : (
          <p style={{ margin: 0 }}>마메치는 관심을 좋아합니다.</p>
        )}
      </div>

      <p className="read-the-docs" style={{ opacity: 0.8 }}>
        마메치에게 연락을 보내거나 칭찬을 건네보세요.
      </p>
    </>
  );
}

/* 간단 답변 로직 */
function makeReply(t) {
  const s = t.toLowerCase();
  if (s.includes('안녕')) return '안녕! 만나서 반가워.';
  if (s.includes('뭐해')) return '코딩하느라 어지럽다~';
  if (s.includes('놀')) return '재밌는 거 있어?';
  if (s.includes('잠')) return '조금 졸려… zZ';
  if (s.includes('좋')) return '좋았구나? 다행이네~';
  const pool = [
    '응, 듣고 있어.',
    '좋은 말이야!',
    `오늘의 행운의 숫자는 ${Math.floor(Math.random() * 100)}이야.`,
    '그렇구나.',
    '기억해 둘게.',
    '오늘 하루는 어땠어?',
    '뭐?! 거짓말.',
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}
