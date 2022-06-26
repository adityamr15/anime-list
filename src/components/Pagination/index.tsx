import './index.css';

export default function Pagination(props: any) {
  const { onPageChange, pageInfo: {
    currentPage,
    hasNextPage
  } } = props;
  const pages = generatePageArray(props.pageInfo);

  return (
    <nav className="text-center">
      <ul className="pagination">
        <li className={(currentPage === 1 && 'disabled') || ''} onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}>
          <span aria-hidden="true">&laquo;</span>
        </li>
        {pages.map((page, id) => (
          <li key={id}
            className={page === currentPage ? 'active' : ''}
            onClick={() => typeof page === 'number' && page !== currentPage ? onPageChange(page) : null}>
            <span>{page}</span>
          </li>
        ))}
        <li className={(!hasNextPage && 'disabled') || ''} onClick={() => hasNextPage && onPageChange(currentPage + 1)}>
          <span aria-hidden="true">&raquo;</span>
        </li>
      </ul>
    </nav>
  );
}

function generatePageArray(pageInfo: any, maxPages = 5): number[] {
  let { currentPage, perPage, total } = pageInfo;
  const totalPages = Math.ceil(total / perPage);
  const pages = [];

  if (currentPage > maxPages) {
    pages.push(1);
    pages.push('...');
  }

  while (pages.length < maxPages) {
    if (currentPage >= totalPages) break;

    pages.push(currentPage);
    currentPage++;
  }

  if (currentPage < totalPages) {
    pages.push('...');
    pages.push(totalPages);
  }

  return pages;
}