
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

