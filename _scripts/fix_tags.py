import frontmatter
import sys
import pathlib
import datetime

for p in pathlib.Path('import_versions/exitwp/_posts').glob('*.markdown'):
    fm = frontmatter.load(str(p))
    tags = fm['tags']
    cats = fm['categories']

    tags_str = "tags:\n" + '\n'.join("- {}".format(tag) for tag in tags)
    cats_str = "categories:\n" + '\n'.join("- {}".format(cat) for cat in cats)

    try:
        dest_post = '_posts/{}.md'.format(p.stem)
        with open(dest_post) as f:
            content = f.read()
    except FileNotFoundError:
        p_split = p.stem.split('-', 3)
        date_prefix = [int(x) for x in p_split[:3]]
        orig_date = datetime.date(*date_prefix)
        new_date = orig_date - datetime.timedelta(1)
        dest_post = '_posts/{:%Y-%m-%d-}{}.md'.format(new_date, p_split[-1])
        with open(dest_post) as f:
            content = f.read()

    nfm = frontmatter.loads(content)
    if not any((nfm.get('tags'), nfm.get('categories'))):
        loc = content.find('\n---\n')
        new_content = "{}\n{}\n{}{}".format(content[:loc], tags_str, cats_str,
                                            content[loc:])
        with open(dest_post, 'w') as f:
            f.write(new_content)
