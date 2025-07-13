import { Paper, Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { ChevronLeft, ChevronRight, Event } from '@mui/icons-material';
import dayjs from 'dayjs';

export default function CalendarEventsCard({
  currentMonth,
  currentYear,
  loading,
  calendarData,
  schedule,
  handlePrevMonth,
  handleNextMonth,
  getEventTypeColor
}) {
  return (
    <Paper elevation={6} sx={{
      p: { xs: 2, md: 4 },
      borderRadius: 4,
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'stretch', md: 'flex-start' },
      justifyContent: 'center',
      gap: { xs: 2, md: 4 },
      background: theme => theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f121a 0%, #1c1e2e 100%)'
        : 'rgba(255,255,255,0.75)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
      backdropFilter: 'blur(12px)',
      border: '1px solid',
      borderColor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(200,200,255,0.18)'
    }}>
      <Box sx={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 0, md: 2 }, width: { xs: '100%', md: 'auto' } }}>
        <Box sx={{ width: '100%', maxWidth: { xs: 320, sm: 360, md: 400 }, minWidth: { xs: 280, sm: 320 } }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.primary', fontFamily: 'var(--font-poppins)' }}>
              {dayjs(new Date(currentYear, currentMonth)).format('MMMM, YYYY')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.secondary' }} onClick={handlePrevMonth} aria-label="Previous month">
                <ChevronLeft fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ color: theme => theme.palette.mode === 'dark' ? '#fff' : 'text.secondary' }} onClick={handleNextMonth} aria-label="Next month">
                <ChevronRight fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', bgcolor: 'transparent', borderTopLeftRadius: 3, borderTopRightRadius: 3, border: 'none', overflow: 'hidden' }}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <Box key={day} sx={{ textAlign: 'center', fontWeight: 700, color: theme => theme.palette.mode === 'dark' ? '#ff4081' : 'primary.main', py: 1, fontSize: '1.1rem', letterSpacing: 1, fontFamily: 'var(--font-poppins)', background: 'transparent' }}>{day}</Box>
            ))}
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', borderRadius: 3, background: 'transparent', minHeight: 400, width: '100%', mx: 'auto', boxShadow: 0, border: 'none', overflow: 'hidden' }}>
              {(calendarData?.calendarDays || Array(42).fill(null)).map((day, index) => (
                <Box key={index} sx={{
                  aspectRatio: '1 / 1',
                  minHeight: 48,
                  maxHeight: 70,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme => theme.palette.mode === 'dark'
                    ? (day?.isToday ? '#ff4081' : day?.isCurrentMonth ? 'rgba(40,40,60,0.85)' : 'rgba(60,60,80,0.5)')
                    : (day?.isToday ? 'primary.main' : day?.isCurrentMonth ? 'rgba(255,255,255,0.6)' : 'rgba(240,240,255,0.4)'),
                  color: theme => theme.palette.mode === 'dark'
                    ? (day?.isToday ? '#fff' : day?.isCurrentMonth ? '#fff' : '#888')
                    : (day?.isToday ? 'primary.contrastText' : day?.isCurrentMonth ? 'text.primary' : 'text.disabled'),
                  fontWeight: day?.isToday ? 700 : 500,
                  fontSize: '1.1rem',
                  cursor: day?.isCurrentMonth ? 'pointer' : 'default',
                  borderRadius: 2,
                  border: day?.isToday ? '2px solid' : 'none',
                  borderColor: day?.isToday ? (theme => theme.palette.mode === 'dark' ? '#fff' : 'primary.dark') : 'transparent',
                  boxShadow: day?.isToday ? 4 : 0,
                  position: 'relative',
                  m: 0.5,
                  transition: 'background 0.2s',
                  '&:hover': day?.isCurrentMonth ? { bgcolor: day?.isToday ? (theme => theme.palette.mode === 'dark' ? '#e91e63' : 'primary.dark') : (theme => theme.palette.mode === 'dark' ? 'rgba(255,64,129,0.08)' : 'rgba(255,128,171,0.12)'), color: day?.isToday ? '#fff' : (theme => theme.palette.mode === 'dark' ? '#ff4081' : 'primary.main') } : {},
                  userSelect: 'none',
                }}>
                  {day?.day || ''}
                  {/* Event dot */}
                  {day?.events && day.events.length > 0 && (
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: theme => theme.palette.mode === 'dark' ? '#FFD600' : 'secondary.main', position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', boxShadow: '0 0 6px #ff80ab88' }} />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ flex: 1, pl: { md: 4, xs: 0 }, width: '100%', minHeight: 400, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 2, fontFamily: 'var(--font-poppins)' }}>Today's Events</Typography>
        {Object.keys(schedule).length > 0 ? (
          <Box sx={{ maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {Object.entries(schedule).slice(0, 3).map(([day, items]) => (
              <Box key={day} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1, fontFamily: 'var(--font-poppins)', display: 'block' }}>{day}</Typography>
                {items.map((item, index) => (
                  <Paper key={index} elevation={2} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, p: 2, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3, gap: 2, minWidth: 220 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: getEventTypeColor(item.type), mt: 0.5, flexShrink: 0, boxShadow: '0 0 8px #ff80ab55' }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ color: 'text.primary', fontFamily: 'var(--font-lexend)', fontWeight: 700, display: 'block' }}>{item.title}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)', display: 'block' }}>{item.time}</Typography>
                      {item.location && <Typography variant="caption" sx={{ color: 'secondary.main', fontFamily: 'var(--font-lexend)', display: 'block', mt: 0.5 }}>📍 {item.location}</Typography>}
                    </Box>
                  </Paper>
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Event sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'var(--font-lexend)' }}>No events scheduled</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
} 