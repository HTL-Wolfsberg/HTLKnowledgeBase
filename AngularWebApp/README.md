## Delete and Setup EF Database

Update-Database -Migration 0
This will remove all migrations from the database. Then you can use:

Remove-Migration
To remove your migration. Finally you can recreate your migration and apply it to the database.

Add-Migration Initialize
Update-Database
