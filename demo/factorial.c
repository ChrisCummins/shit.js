/* factorial.c
 *
 * Just a CPU stress tester:
 *
 *    gcc factorial.c && ./a.out
 */
#include <stdio.h>

void main() {
	int i, num = 1, primes = 0;

	while (num <= 1000000000) {
	        i = 2;
	        while (i <= num) {
			if(num % i == 0)
				break;
			i++;
		}
	        if (i == num)
			primes++;

		printf("[%d] %d %d\n", num, primes, i);
		num++;
	}
}
