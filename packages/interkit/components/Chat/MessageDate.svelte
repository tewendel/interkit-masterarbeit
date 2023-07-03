<script>
  export let message
  export let previousMessage
  export let lastFromSender

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
  <div class="MessageDate message__date">
    {date.toLocaleTimeString(locale, dateOptions(date))}
  </div>
{/if}

<style>
  .message__date {
    font: var(--font-caption);
    padding: 0 var(--distance-s) var(--distance-s) var(--distance-s);
  }
</style>
