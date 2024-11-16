-- 1
INSERT INTO
    account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES
    (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );

-- 2
UPDATE
    account
SET
    account_type = 'Admin'
WHERE
    account_id = 1;

-- 3
DELETE FROM
    account
WHERE
    account_email = 'tony@starkent.com';

-- 4
UPDATE
    public.inventory
SET
    inv_description = REPLACE(
        inv_description,
        'small interiors',
        'huge interior'
    )
WHERE
    inv_description LIKE '%small interiors%';

-- 5
SELECT
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM
    inventory i
    INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE
    c.classification_name = 'Sport';

-- 6
UPDATE
    inventory
SET
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');