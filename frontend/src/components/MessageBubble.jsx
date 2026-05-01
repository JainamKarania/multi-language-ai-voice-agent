export function MessageBubble({ role, text, language }) {
  const isUser = role === 'user'
  const langLabel = language === 'hi' ? '🇮🇳' : '🇬🇧'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      gap: '8px',
      alignItems: 'flex-end',
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--ai-avatar-bg, #6c63ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, flexShrink: 0,
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: '70%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? '#6c63ff' : 'var(--bubble-bg, #f0f0f0)',
        color: isUser ? '#fff' : 'var(--bubble-text, #1a1a1a)',
        fontSize: 15,
        lineHeight: 1.5,
      }}>
        <p style={{ margin: 0 }}>{text}</p>
        {language && (
          <span style={{ fontSize: 10, opacity: 0.6, display: 'block', marginTop: 4 }}>
            {langLabel} {language === 'hi' ? 'Hindi' : 'English'}
          </span>
        )}
      </div>
    </div>
  )
}
