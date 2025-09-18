select
    event.id,
    event.event_name,
    event.event_date,
    event.event_type,
    event.event_time,
    event.event_description,
    event.event_address,
    event.event_city,
    event.event_state,
    event.event_zip,
    event.opponent,
    event.team_score,
    event.opponent_score,
    event.result,
    GROUP_CONCAT(DISTINCT team.team_name ORDER BY team.team_name SEPARATOR ', ') AS teams
from
    event left outer join
    schedule
        on event.id = schedule.event_id left outer join
    team on schedule.team_id = team.id
group by
    event.id,
    event.event_name,
    event.event_date,
    event.event_type,
    event.event_time,
    event.event_description,
    event.event_address,
    event.event_city,
    event.event_state,
    event.event_zip,
    event.opponent,
    event.team_score,
    event.opponent_score,
    event.result
order by
    event.event_date;
