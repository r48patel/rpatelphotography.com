[Feb 17th 2019] Changes to rpatelphotography table for updated_at
```
ALTER TABLE rpatelphotography ADD COLUMN updated_at date;
UPDATE rpatelphotography SET updated_at = '2016-09-07' where title = 'Vancouver';
UPDATE rpatelphotography SET updated_at = '2017-06-14' where title = 'USA Party';
UPDATE rpatelphotography SET updated_at = '2016-12-04' where title = 'Vegas';
UPDATE rpatelphotography SET updated_at = '2016-09-04' where title = 'Seattle';
UPDATE rpatelphotography SET updated_at = '2018-09-02' where title = 'Longhorn Caverns';
UPDATE rpatelphotography SET updated_at = '2018-03-15' where title = 'Boys Trip';
UPDATE rpatelphotography SET updated_at = '2015-09-05' where title = 'CNE';
UPDATE rpatelphotography SET updated_at = '2018-08-11' where title = 'Bat Mitzvah @ Reunion Ranch';
UPDATE rpatelphotography SET updated_at = '2014-12-21' where title = 'Trail of Lights';
UPDATE rpatelphotography SET updated_at = '2016-12-01' where title = 'Maui';
UPDATE rpatelphotography SET updated_at = '2015-12-09' where title = 'Disney';
UPDATE rpatelphotography SET updated_at = '2018-06-18' where title = 'Taste of North Austin';
UPDATE rpatelphotography SET updated_at = '2017-11-05' where title = 'Vintage Car Racing @ COTA';
UPDATE rpatelphotography SET updated_at = '2018-05-30' where title = 'All Hands Meeting';
UPDATE rpatelphotography SET updated_at = '2017-06-17' where title = 'K1 Go Karts';
UPDATE rpatelphotography SET updated_at = '2017-08-23' where title = 'Home';
UPDATE rpatelphotography SET updated_at = '2016-09-06' where title = 'Mount Baker';
UPDATE rpatelphotography SET updated_at = '2018-10-20' where title = 'F1 USGP';
UPDATE rpatelphotography SET updated_at = '2018-09-24' where title = 'Honeymoon';
UPDATE rpatelphotography SET updated_at = '2019-02-17' where title = 'Enchanted Rock';
UPDATE rpatelphotography SET updated_at = '2019-02-17' where title = 'AZ Road Trip';
ALTER TABLE rpatelphotography ALTER COLUMN updated_at SET DEFAULT now();
```
