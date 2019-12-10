#!/usr/bin/Rscript
# Set bounds
# Passing arguments:
# a, b, c, d, n, T, dt
args = commandArgs(trailingOnly = T)
lx <- sapply(args[1:2], as.numeric)
ly <- sapply(args[3:4], as.numeric)
a <- min(lx)
b <- max(lx)
c <- min(ly)
d <- max(ly)
n = as.numeric(args[5])
T = as.numeric(args[6])
dt = as.numeric(args[7])
outputDir = if (length(args) > 7) args[8] else 'output'
# Show speed density
s = seq(T - 20, T + 20, by = .1)
jpeg(paste(outputDir, 'temperature.jpg', sep = '/'))
plot(s, dnorm(s, mean = T, sd = 3), xlab='T', ylab='P', type='l', col='red')
# Generate points with x, y, total speed and angle
points = data.frame(x = runif(n, a, b), y = runif(n, c, d), speed = sqrt(rnorm(n, T, sd = 3)), angle = runif(n, 0, 360), coll=0)
dev.off();

# Show points on plot
jpeg(paste(outputDir, 'initial.jpg', sep = '/'))
plot(c(a -1, a - 1, b + 1, b + 1, a - 1), c(c - 1, d + 1, d + 1, c - 1, c - 1), type='n', xlab='x', ylab='y')
lines(c(a, a,  b, b, a), c(c, d, d, c, c))
points(points$x, points$y, type='p')
dev.off()
# Calculate axis speeds depending on total speed and angle
points$speed_x = points$speed * cos(points$angle)
points$speed_y = points$speed * sin(points$angle)
# Start iterations
it = 0
# Make a move
points$new_x = points$x + points$speed_x * dt
points$new_y = points$y + points$speed_y * dt
# Calculate track of points
# Find out the collision
# Manually check for 4 conditions
conditions = points$new_x >= a & points$new_x <= b & points$new_y >= c & points$new_y <= d
out_bounded = points[!conditions,]
points = points[conditions,]

points$x = points$new_x
points$y = points$new_y

for (i in 1:nrow(out_bounded)){
  r = out_bounded[i,]
  tRem = dt
  r$coll = 0
  while ((r['new_x'] < a || r['new_x'] > b || r['new_y'] < c || r['new_y'] > d) && tRem > 0) {
    r$coll = r$coll + 1
    if (r['speed_x'] > 0) {
      t_x = abs((b - r['x']) / r['speed_x'])
    } else {
      t_x = abs((a + r['x']) / r['speed_x'])
    }
    if (r['speed_y'] > 0) {
      t_y = abs((d - r['y']) / r['speed_y'])
    } else {
      t_y = abs((c + r['y']) / r['speed_y'])
    }
    dt1 = min(t_x, t_y)
    r['x'] = r['x'] + dt1 * r['speed_x']
    r['y'] = r['y'] + dt1 * r['speed_y']
    if (t_x >= t_y) {
      r['speed_y'] = -r['speed_y']
    } else {
     r['speed_x'] = -r['speed_x']
    }
    r['new_x'] = r['x'] + (tRem - dt1) * r['speed_x']
    r['new_y'] = r['y'] + (tRem - dt1) * r['speed_y']
    tRem = max(tRem - dt1, 0)
  }
  r['x'] = r['new_x']
  r['y'] = r['new_y']
  
  points <- rbind(points, r)
}

# Show points on plot
jpeg(paste(outputDir, 'result.jpg', sep = '/'))
plot(c(a -1, a - 1, b + 1, b + 1, a - 1), c(c - 1, d + 1, d + 1, c - 1, c - 1), type='n', xlab='x', ylab='y')
lines(c(a, a,  b, b, a), c(c, d, d, c, c))
no_coll = points[points$coll == 0, ]
one_coll = points[points$coll == 1, ]
more_coll = points[points$coll > 1, ]
points(no_coll$x, no_coll$y, type='p')
points(one_coll$x, one_coll$y, type='p', col='red')
points(more_coll$x, more_coll$y, type='p', col='blue')
sprintf("Pressure:%f",sum(points$coll))
dev.off()