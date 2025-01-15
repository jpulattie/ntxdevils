--viewing teams within a program
select *
from team
join program on team.program_id = program.id
where program.program_name = 'XYZ';