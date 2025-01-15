--viewing teams within a program
select team_name
from team
join program on team.program_id = program.id
where program.program_name = 'XYZ';