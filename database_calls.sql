
--CRUD OPERATIONS FOR TEAM TABLE
--viewing teams program_id to make updates
select team_name, program_id, id
from team
where team_name = 'xyz';

--viewing program_id of all teams
select team_name, program_id, id
from team;


--viewing teams within a program
select team_name
from team
join program on team.program_id = program.id
where program.program_name = 'XYZ';

--insert teams into a program
insert into team (team_name, program_id) values ('team name XYZ', program id xyz)

--delete team from a program
delete from team
where program_id = xyz and team_name = 'team name xyz'

--update team in a program
update team
set team_name = 'new team name xyz'
where team_name = 'current team name xyz' and id = program id;

--CRUD OPERATIONS FOR INFO TABLE
--view all info
select program.program_name, info_title, info_description, info_link
from info
join program on program.id = info.program_id
where program.id = 1;

--view single info
select info_title, info_description, info_link
from info;

--insert info
insert into info(program_id,info_title, info_description, info_link)
values (program id #, 'title xyz', 'description xyz', 'info url xyz');

--delete info
delete from info
where info_id = xyz;

--update info titleteamsi
update info
set info_title = 'new info title xyz'
where info_title = 'current info title xyz' and id = info id;

--update info description 
update info
set info_description = 'new info description xyz'
where info_description = 'current info description xyz' and id = info id;

--update info link
update info
set info_link = 'new info link xyz'
where info_link = 'current info link xyz' and id = info id;

--update all info by id
update info
set info_title = 'new title xyz',
    info_description = 'new desc xyz',
    info_link = 'new link xyz'
where id = info id;



--insert new player
insert into roster(team_id, player_name, position, grade, year_playing, bio, picture_url) 
values ( xyzINT, 'player_name', 'position', 'grade', year_playingINT, 'bio', 'picture_url')

--View Roster page
select
    team.team_name,
    roster.player_name,
    roster.position,
    roster.year_playing,
    roster.bio,
    roster.picture_url
from
    roster
left outer join
    team
on
    roster.team_id = team.id

--insert into schedule/event

insert into event(
    event_name,
    event_type,
    event_date,
    event_time,
    event_description,
    event_address,
    event_city,
    event_state,
    event_zip,
    opponent,
    team_score,
    opponent_score,
    result
) values (
    "event name",
    "event type",
    event_date_DATE_type,
    event_time_TIME_type,
    'event description',
    'event address',
    'event city',
    'event state',
    'event zip',
    'opponent',
    team_score_INT,
    opponent_score_INT,
    'result'
)

set @event_id = LAST_INSERT_ID();

insert into schedule(team_id, event_id) values(pkXYZ, @event_id)

--display schedules
select
    event.event_name,
    event.event_type,
    event.event_date,
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
from
    event
left outer join
    schedule on event.id = schedule.event_id
left outer join
    team on schedule.team_id = team.id
where
    team.team_name = "${teamChoice}";

--display all schedules
select
    event.event_name,
    event.event_type,
    event.event_date,
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
from
    event
left outer join
    schedule on event.id = schedule.event_id
left outer join
    team on schedule.team_id = team.id;


--- insert sponsor
insert into sponsor (
    program_id,
    sponsor_name,
    sponsor_level,
    sponsor_address,
    sponsor_website,
    sponsor_phone,
    sponsor_bio
) values (
    program_ID_INT,
    'sponsor name',
    'sponsor level',
    'sponsor address',
    'sponsor website',
    'sponsor phone', 
    'sponsor bio'
)

--insert into announcements
insert into announcements 
    (program_id, announcement) 
values 
    (program_id, 
    "Title",
    "announcement"
    );


--TEST AREA BELOW--

insert into event(
    event_name,
    event_type,
    event_date,
    event_time,
    event_description,
    opponent

) values (
    'Men vs. Austin',
    'Game',
    '2025-04-28',
    '11:00:00',
    'Mens 18s game',
    'Austin'
);

set @event_id = LAST_INSERT_ID();

insert into schedule(team_id, event_id) values(4, @event_id);



select
    event.event_name,
    event.event_type,
    event.event_date,
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
from
    event
left outer join
    schedule on event.id = schedule.event_id
left outer join
    team on schedule.team_id = team.id
where
    team.team_name = "Mens";