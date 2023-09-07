<script>
  export let message
  export let previousMessage
  export let lastFromSender
  export let isByUser

  const locale = 'de'

  const dateOptionsToday = { hour: 'numeric', minute: 'numeric' };
  const dateOptionsYesterday = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

  const date = message?.createdAt

  const showDate = (message, previousMessage, lastFromSender) => {
    if (previousMessage && previousMessage.sender === message.sender) {
      const previousDate = new Date(previousMessage.createdAt);
      const currentDate = new Date(date);
      // last message was a while ago
      if (date - previousMessage.createdAt > 1000 * 60 * 5) {
        return true;
      }
    }
    // always show date of the last message
    if (lastFromSender) {
      return true;
    }
    return false;
  }

  const dateOptions = (date) => {
    const dateString = date.toLocaleDateString(locale, { year: 'numeric', month: 'numeric', day: 'numeric' } )
    const nowString = new Date().toLocaleDateString(locale, { year: 'numeric', month: 'numeric', day: 'numeric' } )
    return dateString === nowString ? dateOptionsToday : dateOptionsYesterday
  }

</script>

{#if showDate(message, previousMessage, lastFromSender) } 
  <div class="MessageDate message__date message__date--{isByUser ? 'me' : 'other'} MessageDate--user{isByUser ? 'me' : 'other'}">
    {date.toLocaleTimeString(locale, dateOptions(date))}
  </div>
{/if}

<style>

  .message__date {
    font: var(--font-caption);
    letter-spacing: var(--letter-spacing-caption);
    padding: 0 calc(var(--inset-x) * 0.5rem);
    margin: calc(var(--outset-x) * 0.5rem) 0;
  }

  .message__date--me {
    text-align: right;
  }

</style>
